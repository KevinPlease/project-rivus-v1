export function toImageDetails(images) {
  return images.map(imgFile => {
    const src = URL.createObjectURL(imgFile);
    return { id: src, src, isImg: true, file: imgFile };
  });
}
