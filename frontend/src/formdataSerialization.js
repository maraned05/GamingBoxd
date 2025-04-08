export function formDataToSerializable(formData) {
    const obj = {};
    const promises = [];
  
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const filePromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            obj[key] = {
              name: value.name,
              type: value.type,
              dataUrl: reader.result,
            };
            resolve();
          };
          reader.readAsDataURL(value);
        });
  
        promises.push(filePromise);
      } else {
        obj[key] = value;
      }
    }
  
    return Promise.all(promises).then(() => obj);
}

export function objectToFormData(obj) {
    const formData = new FormData();
  
    for (const key in obj) {
      const value = obj[key];
  
      if (value && value.dataUrl && value.type) {
        // Recreate File from base64
        const byteString = atob(value.dataUrl.split(',')[1]);
        const mimeString = value.type;
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], value.name, { type: mimeString });
        formData.append(key, file);
      } else {
        formData.append(key, value);
      }
    }
  
    return formData;
}
  