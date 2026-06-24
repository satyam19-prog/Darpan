import { parse } from 'csv-parse/sync';
import { fetchWithRetry } from '../utils/apiUtils';

export class GoogleSheetsService {
  /**
   * Parse a public Google Sheets URL to get the spreadsheet ID.
   */
  private extractSheetId(url: string): string | null {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  /**
   * Fetch data from a public Google Sheet as CSV.
   * Format expected: Name, Email, CF Handle, LC Handle, CC Handle
   */
  async fetchStudentsFromSheet(sheetUrl: string) {
    const sheetId = this.extractSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

    // Use the export?format=csv endpoint for public sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    const csvContent = await fetchWithRetry<string>(csvUrl);
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    return records.map((record: any) => ({
      name: record['Name'] || record['name'],
      email: record['Email'] || record['email'],
      cfHandle: record['CF Handle'] || record['cf_handle'] || record['Codeforces'],
      lcHandle: record['LC Handle'] || record['lc_handle'] || record['LeetCode'],
      ccHandle: record['CC Handle'] || record['cc_handle'] || record['CodeChef'],
    })).filter((r: any) => r.name && r.email); // Basic validation
  }
}
