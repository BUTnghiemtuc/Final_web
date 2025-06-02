const mongoose = require("mongoose");
require("dotenv").config();

const models = require("../modelData/models.js");
const User = require("./userModel.js");
const Photo = require("./photoModel.js");
const SchemaInfo = require("./schemaInfo.js");

const versionString = "1.0";

async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/photoapp");
    console.log("✅ Connected to MongoDB");

    // Xoá sạch dữ liệu cũ
    await User.deleteMany({});
    await Photo.deleteMany({});
    await SchemaInfo.deleteMany({});
    console.log("🧹 Cleared all existing data");

    const userModels = models.userListModel();
    const mapFakeIdToRealId = {};

    // Insert users
    for (const user of userModels) {
      const newUser = new User({
        login_name: user.first_name.toLowerCase(), // tạo login_name tự động
        password: "123456", // mật khẩu mặc định
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation
      });

      await newUser.save();
      mapFakeIdToRealId[user._id] = newUser._id;
      user.objectID = newUser._id;
      console.log(`👤 Created user: ${user.first_name} ${user.last_name}`);
    }

    // Insert photos
    const allPhotos = [];
    const userIDs = Object.keys(mapFakeIdToRealId);

    userIDs.forEach((fakeId) => {
      const photos = models.photoOfUserModel(fakeId);
      allPhotos.push(...photos);
    });

    for (const photo of allPhotos) {
      const newPhoto = new Photo({
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: mapFakeIdToRealId[photo.user_id],
        comments: []
      });

      // Gắn comment (nếu có)
      if (photo.comments && photo.comments.length > 0) {
        for (const cmt of photo.comments) {
          const realUserId = mapFakeIdToRealId[cmt.user._id];
          newPhoto.comments.push({
            comment: cmt.comment,
            date_time: cmt.date_time,
            user: {
              _id: realUserId,
              first_name: cmt.user.first_name,
              last_name: cmt.user.last_name
            }
          });
          console.log(`💬 Add comment by ${cmt.user.first_name} to ${photo.file_name}`);
        }
      }

      await newPhoto.save();
      console.log(`🖼 Inserted photo: ${photo.file_name}`);
    }

    // Insert schema info
    const schemaInfo = new SchemaInfo({
      version: versionString
    });
    await schemaInfo.save();
    console.log("📘 Inserted schemaInfo with version", versionString);

    await mongoose.disconnect();
    console.log("✅ Done loading data and disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error loading data:", err);
    process.exit(1);
  }
}

dbLoad();
