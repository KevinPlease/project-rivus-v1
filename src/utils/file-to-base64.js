export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export const base64ToFile = (base64, filename) => {
  let arr = base64.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = Buffer.from(arr[arr.length - 1], "base64"),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr[n];
  }
  return new File([u8arr], filename, { type: mime });
};
