// src/utils/firestore.js
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

/**
 * Upload image to Firebase Storage and return download URL
 */
export const uploadImageToStorage = async (imageData, userId, roomId, index) => {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to upload images');
    }

    // Convert base64 to blob if needed
    let blob;
    let contentType = 'image/jpeg';
    
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      // Base64 image - extract MIME type and convert to blob
      const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        contentType = matches[1] || 'image/jpeg';
        const base64Data = matches[2];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: contentType });
      } else {
        // Fallback: try fetch method
        const response = await fetch(imageData);
        blob = await response.blob();
        contentType = blob.type || 'image/jpeg';
      }
    } else if (imageData instanceof Blob) {
      blob = imageData;
      contentType = imageData.type || 'image/jpeg';
    } else if (imageData instanceof File) {
      blob = imageData;
      contentType = imageData.type || 'image/jpeg';
    } else {
      throw new Error('Invalid image data format');
    }

    // Create storage reference with proper path
    const timestamp = Date.now();
    const fileExtension = contentType.includes('png') ? 'png' : 
                          contentType.includes('gif') ? 'gif' : 
                          contentType.includes('webp') ? 'webp' : 'jpg';
    const fileName = `image_${index}_${timestamp}.${fileExtension}`;
    const imageRef = ref(storage, `rooms/${userId}/${roomId}/${fileName}`);
    
    // Upload image with proper metadata
    const metadata = {
      contentType: contentType,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
        roomId: roomId
      }
    };
    
    // Upload to Firebase Storage
    await uploadBytes(imageRef, blob, metadata);
    
    // Get the public download URL
    const downloadURL = await getDownloadURL(imageRef);
    
    console.log(`Image uploaded successfully: ${downloadURL}`);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Storage:', error);
    
    // Provide helpful error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error(
        'Storage upload unauthorized. Please check Firebase Storage security rules. ' +
        'The rules should allow authenticated users to write to "rooms/{userId}/{roomId}/{allFiles}".'
      );
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Unknown storage error. Please check Firebase Storage configuration and security rules.');
    } else if (error.message && error.message.includes('CORS')) {
      throw new Error(
        'CORS error: Firebase Storage security rules may be blocking the upload. ' +
        'Please configure Storage rules to allow authenticated uploads.'
      );
    }
    
    throw new Error(`Failed to upload image: ${error.message || error.code || 'Unknown error'}`);
  }
};

/**
 * Upload multiple images to Firebase Storage and return download URLs
 * All images are uploaded to Storage and URLs are returned for Firestore storage
 */
export const uploadImages = async (images, userId, roomId) => {
  try {
    if (!images || images.length === 0) {
      return [];
    }

    const imageUrls = [];
    
    // Upload images sequentially to avoid overwhelming Storage
    for (let i = 0; i < images.length; i++) {
      try {
        console.log(`Uploading image ${i + 1}/${images.length}...`);
        const url = await uploadImageToStorage(images[i], userId, roomId, i);
        imageUrls.push(url);
        console.log(`Image ${i + 1} uploaded successfully`);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        // Re-throw to stop the process - user should fix Storage rules
        throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
      }
    }
    
    console.log(`All ${imageUrls.length} images uploaded successfully`);
    return imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Save room/property to Firestore
 * @param {Object} roomData - Room data including image URLs
 * @param {string} userId - Landlord user ID
 * @param {string} userName - Landlord name
 * @param {string} roomId - Pre-generated room ID (optional, will generate if not provided)
 */
export const saveRoomToFirestore = async (roomData, userId, userName, roomId = null) => {
  try {
    // Generate room ID if not provided
    const finalRoomId = roomId || doc(collection(db, 'rooms')).id;
    
    const roomDoc = {
      room_id: finalRoomId,
      title: roomData.title,
      price: roomData.price,
      type: roomData.type,
      location: roomData.location,
      distance: 'N/A', // Will be calculated with GPS later
      amenities: roomData.amenities || [],
      images: roomData.images || [], // Firebase Storage URLs
      landlord_id: userId,
      landlord_name: userName,
      contact_number: roomData.contact_number,
      description: roomData.description || '',
      furnished: roomData.furnished !== undefined ? roomData.furnished : true,
      gender_preference: roomData.gender_preference || 'any',
      created_at: serverTimestamp()
    };
    
    await setDoc(doc(db, 'rooms', finalRoomId), roomDoc);
    
    console.log(`Room saved to Firestore with ${roomDoc.images.length} image URLs`);
    
    return { roomId: finalRoomId, ...roomDoc };
  } catch (error) {
    console.error('Error saving room to Firestore:', error);
    throw new Error('Failed to save room');
  }
};

/**
 * Get all rooms from Firestore
 */
export const getAllRooms = async () => {
  try {
    const roomsRef = collection(db, 'rooms');
    const snapshot = await getDocs(roomsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
};

/**
 * Get rooms by landlord ID
 */
export const getRoomsByLandlord = async (landlordId) => {
  try {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('landlord_id', '==', landlordId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching landlord rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
};

/**
 * Get room by ID
 */
export const getRoomById = async (roomId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Room not found');
    }
    
    return {
      id: roomSnap.id,
      ...roomSnap.data()
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};

/**
 * Delete room from Firestore
 */
export const deleteRoom = async (roomId, userId) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      throw new Error('Room not found');
    }
    
    const roomData = roomSnap.data();
    if (roomData.landlord_id !== userId) {
      throw new Error('Not authorized to delete this room');
    }
    
    // Delete room document
    await setDoc(roomRef, { deleted: true }, { merge: true });
    // Or use deleteDoc if you want to permanently delete
    // await deleteDoc(roomRef);
    
    return { message: 'Room deleted successfully' };
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

/**
 * Record a swipe action (like/dislike) in Firestore
 */
export const recordSwipe = async (userId, roomId, action) => {
  try {
    const swipeRef = doc(collection(db, 'swipes'));
    await setDoc(swipeRef, {
      user_id: userId,
      room_id: roomId,
      action: action, // 'like' or 'dislike'
      created_at: serverTimestamp()
    });
    
    // Check if it's a match (both landlord and student liked)
    if (action === 'like') {
      // Get room to find landlord
      const room = await getRoomById(roomId);
      const landlordId = room.landlord_id;
      
      // Check if landlord has liked this student (simplified - you might want to check student profile)
      // For now, we'll just return a basic match score
      return {
        is_match: false, // You can implement match logic here
        match_score: 75 // Default match score
      };
    }
    
    return { is_match: false, match_score: 0 };
  } catch (error) {
    console.error('Error recording swipe:', error);
    throw error;
  }
};

/**
 * Get liked rooms for a user
 */
export const getLikedRooms = async (userId) => {
  try {
    const swipesRef = collection(db, 'swipes');
    const q = query(
      swipesRef,
      where('user_id', '==', userId),
      where('action', '==', 'like')
    );
    const snapshot = await getDocs(q);
    
    const likedRoomIds = snapshot.docs.map(doc => doc.data().room_id);
    
    // Fetch room details for liked rooms
    const likedRooms = [];
    for (const roomId of likedRoomIds) {
      try {
        const room = await getRoomById(roomId);
        likedRooms.push(room);
      } catch (error) {
        console.warn(`Room ${roomId} not found, skipping`);
      }
    }
    
    return likedRooms;
  } catch (error) {
    console.error('Error fetching liked rooms:', error);
    throw error;
  }
};

/**
 * Get all swiped room IDs for a user (both likes and dislikes)
 * Used to filter out already-seen rooms from recommendations
 */
export const getSwipedRoomIds = async (userId) => {
  try {
    const swipesRef = collection(db, 'swipes');
    const q = query(swipesRef, where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    
    const swipedRoomIds = snapshot.docs.map(doc => doc.data().room_id);
    return swipedRoomIds;
  } catch (error) {
    console.error('Error fetching swiped room IDs:', error);
    return [];
  }
};

