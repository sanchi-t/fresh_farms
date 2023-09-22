import Cookies from "js-cookie";

// Fetch all crops from Farmers
export const fetchCrops = async () => {
  try {
    const res = await fetch("/api/job/cropsData", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`
      }
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching crops: ", error);
    throw error; // Optionally, you can rethrow the error to handle it in the calling code.
  }
};

// Bookmark a crop
export const modifyCrops = async (_id,cropName,quantity) => {
  try {
    const res = await fetch("/api/job/cropsData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("token")}`
      },
      body: JSON.stringify({
        farmerId: _id,
        cropName: cropName,
        quantity,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error modifying quantity crop: ", error);
    throw error;
  }
};

// Get bookmarked crops
export const getBookmarkedCrops = async () => {
  try {
    const res = await fetch("/api/farmers/job/bookmarks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`
      }
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error getting bookmarked crops: ", error);
    throw error;
  }
};

// Unbookmark a crop
export const unbookmarkCrop = async (cropId) => {
  try {
    const res = await fetch("/api/farmers/crops/bookmark", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cropId })
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error unbookmarking crop: ", error);
    throw error;
  }
};
