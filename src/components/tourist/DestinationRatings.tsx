import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Camera, MessageSquare, ChevronUp,
  Shield, Heart, CheckCircle
} from 'lucide-react';

interface DestinationRatingsProps {
  isVisible: boolean;
  onClose: () => void;
  currentLocation: string;
}

const DestinationRatings: React.FC<DestinationRatingsProps> = ({ isVisible, onClose, currentLocation }) => {
  const [selectedTab, setSelectedTab] = useState<'nearby' | 'reviews' | 'rate'>('nearby');
  const [userRating, setUserRating] = useState(0);
  const [userSafetyRating, setUserSafetyRating] = useState(0);

  const destinations = [
    {
      id: 1,
      name: 'Ward Lake',
      category: 'Attraction',
      rating: 4.7,
      safetyScore: 9.2,
      totalReviews: 234,
      distance: '0.3 km',
      priceRange: 'Free'
    },
    {
      id: 2,
      name: 'Don Bosco Museum',
      category: 'Museum',
      rating: 4.8,
      safetyScore: 9.5,
      totalReviews: 156,
      distance: '1.2 km',
      priceRange: '₹30-50'
    },
    {
      id: 3,
      name: 'Police Bazaar',
      category: 'Shopping',
      rating: 4.3,
      safetyScore: 8.8,
      totalReviews: 89,
      distance: '0.8 km',
      priceRange: '₹100-500'
    }
  ];

  const reviews = [
    {
      id: 1,
      userName: 'Sarah Thompson',
      userAvatar: '👩‍🦱',
      rating: 5,
      safetyRating: 9,
      date: '2 days ago',
      title: 'Beautiful and peaceful spot!',
      content: 'Ward Lake is absolutely stunning, especially during sunrise. The walking paths are well-maintained and I felt completely safe.',
      likes: 24,
      photos: 5,
      verified: true,
      tags: ['peaceful', 'safe', 'family-friendly']
    },
    {
      id: 2,
      userName: 'Rajesh Kumar',
      userAvatar: '👨‍💼',
      rating: 4,
      safetyRating: 8,
      date: '1 week ago',
      title: 'Great cultural experience',
      content: 'Don Bosco Museum offers an excellent insight into Northeast culture. Security is good, staff is helpful.',
      likes: 18,
      photos: 3,
      verified: true,
      tags: ['cultural', 'educational']
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
          >
            <Star 
              className={`w-4 h-4 ${
                star <= rating 
                  ? 'text-yellow-500 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Ratings & Reviews</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{currentLocation}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6">
              {[
                { id: 'nearby', label: 'Nearby Places', icon: MapPin },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                { id: 'rate', label: 'Rate Place', icon: Star }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as 'nearby' | 'reviews' | 'rate')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    selectedTab === tab.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {selectedTab === 'nearby' && (
                <div className="space-y-3">
                  {destinations.map((destination) => (
                    <motion.div
                      key={destination.id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-900">{destination.name}</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {destination.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{destination.distance}</span>
                            </span>
                            <span>{destination.priceRange}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(destination.rating)}
                            <span className={`font-bold ${getRatingColor(destination.rating)}`}>
                              {destination.rating}
                            </span>
                            <span className="text-xs text-gray-500">({destination.totalReviews})</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Shield className={`w-4 h-4 ${getSafetyColor(destination.safetyScore)}`} />
                            <span className={`text-sm font-semibold ${getSafetyColor(destination.safetyScore)}`}>
                              {destination.safetyScore}/10
                            </span>
                          </div>
                        </div>
                        
                        <motion.button
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <span className="text-2xl">{review.userAvatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900">{review.userName}</span>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className={`w-3 h-3 ${getSafetyColor(review.safetyRating)}`} />
                              <span className="text-sm font-medium">Safety: {review.safetyRating}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.content}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{review.likes}</span>
                          </button>
                          {review.photos > 0 && (
                            <span className="flex items-center space-x-1">
                              <Camera className="w-4 h-4" />
                              <span>{review.photos} photos</span>
                            </span>
                          )}
                        </div>
                        <button className="text-orange-500 hover:text-orange-700 font-medium">
                          Reply
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedTab === 'rate' && (
                <motion.div
                  className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h4 className="font-bold text-gray-900 mb-4 text-center">Rate Your Experience</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
                      <div className="flex items-center justify-center space-x-2">
                        {renderStars(userRating, true, setUserRating)}
                        <span className="ml-2 font-medium text-gray-700">{userRating}/5</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Safety Rating</label>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                            <motion.button
                              key={rating}
                              onClick={() => setUserSafetyRating(rating)}
                              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                                rating <= userSafetyRating
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {rating}
                            </motion.button>
                          ))}
                        </div>
                        <span className="ml-2 font-medium text-gray-700">{userSafetyRating}/10</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
                      <input 
                        type="text"
                        placeholder="Summarize your experience..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Review</label>
                      <textarea 
                        placeholder="Share your experience, safety observations, tips for other tourists..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <motion.button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Camera className="w-4 h-4" />
                        <span>Add Photos</span>
                      </motion.button>
                      <motion.button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Submit Review
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={onClose}
              className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DestinationRatings;