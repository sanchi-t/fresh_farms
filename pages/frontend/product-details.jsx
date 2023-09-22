import { useRouter } from 'next/router';
import Farmer from '@/models/Farmer'; // Import your Farmer model
import NavBar from '@/components/NavBar';
import { useState } from 'react';
import { modifyCrops } from '@/Services/job/cropsData';

const ProductDetailsPage = ({ farmer, crop }) => {
  const router = useRouter();
  const { farmerId, cropName } = router.query;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [quantity, setQuantity] = useState(1);

  if (!farmer || !crop) {
    return <div>Data not found</div>;
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1 && newQuantity <= crop.quantity) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    return quantity * crop.price;
  };

  const handleBuyNow = async () => {
    const totalPrice = calculateTotalPrice();

    const response = await modifyCrops(farmer._id, crop.cropName, quantity);
    console.log(response);
    if (response.message=='Purchase successful') {
      // Update the crop quantity in the crop object
      crop.quantity -= quantity;
      setIsPopupOpen(true);
    } else {
      // Handle the case where the purchase request failed
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <NavBar />
      <div className="w-full py-20 flex items-center md:px-8 px-2 justify-center flex-col">
        <h1 className="px-4 mx-2 py-2 uppercase tracking-wider border-b-2 border-b-indigo-600 text-3xl font-semibold">
          {crop.cropName}
        </h1>
        <div className="w-full h-full py-4 flex overflow-y-auto items-center justify-center flex-wrap">
          <div className="max-w-5xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="sm:flex sm:items-center px-6 py-4">
                <img
                  src={crop.images}
                  alt={crop.cropName}
                  className="rounded-lg sm:w-1/3 sm:object-cover sm:object-center"
                />
                <div className="sm:ml-6 mt-4 sm:mt-0">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {crop.cropName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Description: {crop.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {crop.quantity}kg
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{crop.price}/kg
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {farmer.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Posted by: {farmer.firstName} {farmer.lastName}
                  </p>
                  <div className="mt-4">
                    <label className="text-sm text-gray-600">
                      Quantity (kg):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={crop.quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Total Price: ₹{calculateTotalPrice()}
                  </p>
                  <button
                    onClick={handleBuyNow}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Larger Transaction Complete Pop-up */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 w-55">
          <div className="bg-white rounded-lg p-8 shadow-lg w-555">
            <h2 className="text-xl font-semibold mb-4">Transaction Complete</h2>
            <p>Your purchase was successful!</p>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Fetch the data based on 'farmerId' and 'cropName'
export async function getServerSideProps(context) {
  const { farmerId, cropName } = context.query;

  try {
    // Retrieve the farmer and crop data based on IDs
    const farmer = await Farmer.findById(farmerId);
    const crop = farmer.crops.find((c) => c.cropName === cropName);

    if (!farmer || !crop) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        farmer: JSON.parse(JSON.stringify(farmer)), // Convert to JSON
        crop: JSON.parse(JSON.stringify(crop)), // Convert to JSON
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      notFound: true,
    };
  }
}

export default ProductDetailsPage;
