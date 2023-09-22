import ConnectDB from '@/DB/connectDB';
import Farmer from '@/models/Farmer';
import validateToken from '@/middleware/tokenValidation';
import Joi from 'joi';

const schema = Joi.object({
  cropName: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  images: Joi.string().required(),
  // Remove the 'farmer' field from validation as it's already defined in the model
  // Add more fields as needed
});

export default async (req, res) => {
  await ConnectDB();
  const { method } = req;
  switch (method) {
    case 'POST':
      await validateToken(req, res, async () => {
        await postCropForSale(req, res);
      });
      break;
    case 'GET':
        await displayCropsForSale(req, res);
      // Retrieve and display crops for sale
      
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid Request' });
  }
}

const postCropForSale = async (req, res) => {
  try {
    const { farmerId, cropName, quantity } = req.body;

    // Find the farmer and crop
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const crop = farmer.crops.find((c) => c.cropName === cropName);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Verify that the requested quantity is valid
    if (quantity < 1 || quantity > crop.quantity) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Update the crop quantity in the database
    crop.quantity -= quantity;
    await farmer.save();

    // Send a success response
    return res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const displayCropsForSale = async (req, res) => {
  try {
    // Query the Farmer collection to get crops for sale
    const farmersWithCrops = await Farmer.find({ 'crops.0': { $exists: true } });

    // Extract and format the crop data for display
    
    const cropsForSale = farmersWithCrops.reduce((cropsList, farmer) => {
      farmer.crops.forEach((crop) => {
        cropsList.push({
          _id: farmer._id,
          cropName: crop.cropName,
          description: crop.description,
          quantity: crop.quantity,
          price: crop.price,
          image: crop.images,
          farmer: {
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            email: farmer.email,
            address: farmer.address,
            phoneNumber: farmer.phoneNumber
            // Add more farmer details as needed
          },
           // Store the images field as an array of image URLs
        });
        
      });
      return cropsList;
    }, []);

    // if (cropsForSale.length > 0) {
    // }

    return res.status(200).json({ success: true, crops: cropsForSale });
  } catch (error) {
    console.error('Error fetching crops for sale:', error);
    return res.status(500).json({ success: false, message: 'Something Went Wrong. Please Retry.' });
  }
};
