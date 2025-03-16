export const uploadMultipleImage = async (files) => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/upload`;
  const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_PRESET;

  const uploadPromies = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("🚀 ~ uploadPromies ~ data:", data);
    if (!response.ok) {
      throw new Error(data.message);
    }
    return {
      public_id: data.public_id,
      url: data.secure_url,
    };
  });
  try {
    const results = await Promise.all(uploadPromies);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
