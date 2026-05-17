// --- HTTP SOCIAL MEDIA BULLETINS ENDPOINTS ---

// 1. GET: Pull all written billboard announcements from Firestore
app.get('/api/community/posts', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('communityPosts')
      .orderBy('timestamp', 'desc')
      .get();

    const posts = [];
    postsSnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error gathering feed details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST: Commit a fresh community billboard payload to Firestore
app.post('/api/community/posts', async (req, res) => {
  try {
    const { uid, displayName, email, content, promotedRoom } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: "Content area block invalid." });
    }

    const newPostObject = {
      uid,
      displayName,
      email,
      content,
      promotedRoom: promotedRoom || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp() // Safe server timing
    };

    const docRef = await db.collection('communityPosts').add(newPostObject);
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating feed item:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});