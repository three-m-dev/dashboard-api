import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as jsonFile from 'jsonfile';
import { addDays } from 'date-fns';

export class WatcherService {
  public async watch(path: string) {
    let previousData: any[] = [];

    const readExcelFile = (): any[] => {
      const workbook = xlsx.readFile(path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_json(worksheet);
    };

    const compareData = (newData: any[]) => {
      const changes: any[] = [];
      newData.forEach((row, index) => {
        if (previousData[index] || JSON.stringify(row) !== JSON.stringify(previousData[index])) {
          changes.push({ index, row });
        }
      });
      return changes;
    };

    const logChanges = (changes: any[]) => {
      changes.forEach((change) => {
        console.log(`Change at row ${change.index}: `, change.row);
      });
    };

    fs.watch(path, { persistent: true }, (eventType, filename) => {
      if (eventType === 'change' && !filename!.startsWith('~$')) {
        console.log(`Detected change in ${filename}`);
        try {
          const newData = readExcelFile();
          const changes = compareData(newData);
          if (changes.length > 0) {
            logChanges(changes);
          }
          previousData = newData;

          this.commit(previousData);
        } catch (error) {
          console.error('Error reading Excel file:', error);
        }
      }
    });
  }

  public async commit(data: any) {
    data.forEach((item: any) => {
      if (item.Date) {
        item.Date = this.convertExcelDateToDate(item.Date);
      }
    });

    jsonFile.writeFile('./src/data/watcher.json', data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  }

  private convertExcelDateToDate(serial: any) {
    const excelEpoch = new Date(1899, 11, 30);
    return addDays(excelEpoch, serial);
  }
}
