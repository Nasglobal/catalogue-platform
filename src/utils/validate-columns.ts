export function validateColumns(
  uploadedColumns: string[],
  expectedColumns: string[],
) {

  const normalizedUploaded =
    uploadedColumns.map((c) =>
      String(c).trim(),
    );

  const missingColumns =
    expectedColumns.filter(
      (col) =>
        !normalizedUploaded.includes(col),
    );

  const unexpectedColumns =
    normalizedUploaded.filter(
      (col) =>
        !expectedColumns.includes(col),
    );

  return {

    valid:
      missingColumns.length === 0,

    missingColumns,

    unexpectedColumns,
  };
}