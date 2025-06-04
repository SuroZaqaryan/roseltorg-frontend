export const handleSaveRow = (dataSource: any[], setDataSource: (data: any[]) => void) => (row: any) => {
  const newData = [...dataSource];
  const index = newData.findIndex(item => row.key === item.key);
  const item = newData[index];
  newData.splice(index, 1, { ...item, ...row });
  setDataSource(newData);
};
