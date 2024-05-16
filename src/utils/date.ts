export const transformToDate = (string: string) => {
  const date = new Date(string)
  date.setMinutes(date.getMinutes());
  return date
}