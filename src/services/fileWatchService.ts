import * as xlsx from 'xlsx';
import * as jsonFile from 'jsonfile';
import * as fs from 'fs';

interface DataRow {
  [key: string]: string | number;
}

export class FileWatchService {
  private currentDataPath: string = './src/data/watcher.json';
  private watchedFilePath: string;
  private debounceTimeout: NodeJS.Timeout | null = null;

  constructor(watchedFilePath: string) {
    this.watchedFilePath = watchedFilePath;
  }

  private getCurrentData(): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      jsonFile.readFile(this.currentDataPath, (err, data: DataRow[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private getNewData(): DataRow[] {
    const workbook = xlsx.readFile(this.watchedFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData: DataRow[] = xlsx.utils.sheet_to_json(worksheet);

    jsonData = jsonData.map((row) => {
      for (const key in row) {
        if (key.includes('Date') && typeof row[key] === 'number') {
          row[key] = this.convertSerialToDate(row[key] as number);
        }
      }
      return row;
    });

    return jsonData;
  }

  private convertSerialToDate(serial: number): string {
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return date.toISOString();
  }

  private compareData(currentData: DataRow[], newData: DataRow[]): boolean {
    const currentDataLength = currentData.length;
    const newDataLength = newData.length;
    const maxDataLength = Math.max(currentDataLength, newDataLength);
    let sheetChanged = false;

    for (let i = 0; i < maxDataLength; i++) {
      const currentRow = currentData[i];
      const newRow = newData[i];

      if (!newRow) {
        console.log(`Row removed: ${JSON.stringify(currentRow)}`);
        sheetChanged = true;
        continue;
      }

      if (!currentRow) {
        console.log(`New row added: ${JSON.stringify(newRow)}`);
        sheetChanged = true;
        continue;
      }

      for (const key in newRow) {
        if (newRow[key] !== currentRow[key]) {
          console.log(`Change detected in row ${i + 1}, column ${key}: '${currentRow[key]}' -> '${newRow[key]}'`);
          sheetChanged = true;
        }
      }

      for (const key in currentRow) {
        if (!newRow.hasOwnProperty(key)) {
          console.log(`Cell removed in row ${i + 1}, column ${key}: '${currentRow[key]}'`);
          sheetChanged = true;
        }
      }
    }

    return sheetChanged;
  }

  public async watch(): Promise<void> {
    fs.watch(this.watchedFilePath, (eventType, filename) => {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(async () => {
        if (eventType === 'change') {
          console.log(`File ${filename} has been saved. Processing changes...`);
          const currentData = await this.getCurrentData();
          const newData = this.getNewData();

          const isChanged = this.compareData(currentData, newData);

          if (isChanged) {
            jsonFile.writeFile(this.currentDataPath, newData, { spaces: 2 }, (err) => {
              if (err) {
                console.error('Error writing to JSON file:', err);
              } else {
                console.log('JSON file updated successfully.');
              }
            });
          } else {
            console.log('No changes detected.');
          }
        }
      }, 300);
    });

    console.log(`Watching for changes in file: ${this.watchedFilePath}`);
  }
}
