import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  async download(filename: string, data: object): Promise<void> {
    const dateStr = new Date().toISOString().slice(0, 10);
    const fullFilename = `${filename}-${dateStr}.json`;
    const jsonStr = JSON.stringify(data, null, 2);

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.writeFile({
          path: fullFilename,
          data: jsonStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });
        await Share.share({
          title: fullFilename,
          url: result.uri,
          dialogTitle: 'Save or share exported data',
        });
      } catch (err) {
        console.error('Export failed:', err);
        alert('Export failed. Please try again.');
      }
    } else {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFilename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
