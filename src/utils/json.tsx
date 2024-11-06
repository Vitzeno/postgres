export function jsonToMarkdownTable(jsonData: object | object[]): string {
  const jsonArray = Array.isArray(jsonData) ? jsonData : [jsonData];

  if (jsonArray.length === 0) {
    return "No data available";
  }

  // Extract headers from the first object
  const headers = Object.keys(jsonArray[0]);

  // Create the header row
  const headerRow = `| ${headers.join(" | ")} |`;

  // Create the separator row
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;

  // Create the data rows
  const dataRows = jsonArray
    .map((obj) => {
      const row = headers.map((header) => {
        const value = obj[header];
        return typeof value === "string" || typeof value === "number" ? value : JSON.stringify(value);
      });
      return `| ${row.join(" | ")} |`;
    })
    .join("\n");

  // Combine all rows into the final Markdown table
  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}
