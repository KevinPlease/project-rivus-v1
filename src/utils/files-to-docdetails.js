export function toDocDetails(docFiles) {
  return docFiles.map(docFile => {
    const src = URL.createObjectURL(docFile);
    return { id: src, src, isImg: false, file: docFile };
  });
}
