import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  crops: [
    {
      cropName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },      
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      images:{
          type: String,
          required: true,
        }
    },
  ],
});

const Farmer = mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);

export default Farmer;
