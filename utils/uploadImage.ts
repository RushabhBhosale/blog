export async function uploadImageToCloudinary(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: reader.result }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          return reject(errorData.error || "Failed to upload image");
        }

        const data = await res.json();
        resolve(data.url);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject("File reading failed");
    reader.readAsDataURL(file);
  });
}
