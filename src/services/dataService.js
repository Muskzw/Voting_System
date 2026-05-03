import { MOCK_CANDIDATES } from '../data/mockData';

const SHEET_ID = '1t7iKWWYencB9UXDy7XJUnZ-NiO7ieEt1FssGfhKq_Co';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1194108142`;

export const fetchCandidatesFromSheet = async () => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    const candidatesByRole = {};
    
    dataRows.forEach((row, index) => {
      if (row.length < 7) return; // Basic validation
      
      const [timestamp, fullName, studentId, year, phone, email, position, otherPos, manifesto, photoUrl] = row;
      
      if (!fullName || !position) return;
      
      const roleKey = position.toLowerCase().replace(/\s+/g, '_');
      
      if (!candidatesByRole[roleKey]) {
        candidatesByRole[roleKey] = [];
      }
      
      candidatesByRole[roleKey].push({
        id: `c-${index}`,
        name: fullName,
        course: year,
        bio: manifesto || `Nominated for ${position}.`,
        email: email,
        photo: convertDriveUrl(photoUrl)
      });
    });
    
    return candidatesByRole;
  } catch (error) {
    console.error('Error fetching candidates from Google Sheet:', error);
    // Fallback to mock data if fetch fails
    return MOCK_CANDIDATES;
  }
};

/**
 * Simple CSV parser that handles quoted values with commas
 */
function parseCSV(text) {
  const result = [];
  let row = [];
  let col = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        col += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(col.trim());
      col = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (col || row.length > 0) {
        row.push(col.trim());
        result.push(row);
        row = [];
        col = '';
      }
      if (char === '\r' && nextChar === '\n') i++;
    } else {
      col += char;
    }
  }
  
  if (col || row.length > 0) {
    row.push(col.trim());
    result.push(row);
  }
  
  return result;
}

/**
 * Converts a regular Google Drive share link to a direct image link.
 */
function convertDriveUrl(url) {
  if (!url || !url.includes('drive.google.com')) return url;
  
  // Handle various Google Drive link formats
  const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1] || 
                 url.match(/id=([^\&]+)/)?.[1] ||
                 url.match(/\/open\?id=([^\&]+)/)?.[1];
                 
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
}
