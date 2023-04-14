export function sortByDate(a: any, b: any) {
  return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}
