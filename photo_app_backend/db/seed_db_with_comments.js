const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/photoapp");

const SchemaInfo = mongoose.model("SchemaInfo", new mongoose.Schema({
  version: String,
  load_date_time: { type: Date, default: Date.now }
}));

const Photo = mongoose.model("Photo", new mongoose.Schema({
  file_name: String,
  date_time: String,
  user_id: mongoose.Schema.Types.ObjectId,
  comments: [
    {
      comment: String,
      date_time: String,
      user: {
        _id: mongoose.Schema.Types.ObjectId,
        first_name: String,
        last_name: String
      }
    }
  ]
}));

// User thực trong MongoDB (đảm bảo tồn tại)
const users = [
  {
    _id: new mongoose.Types.ObjectId("683c4d0b80a291d2884d12dc"),
    first_name: "Khoi",
    last_name: "Nguyen"
  },
  {
    _id: new mongoose.Types.ObjectId("683d0a9c72261b46f2d3fdd0"),
    first_name: "An",
    last_name: "Truong"
  },
  {
    _id: new mongoose.Types.ObjectId("683d0b8c72261b46f2d3fdd3"),
    first_name: "Sinh",
    last_name: "Truong"
  }
];

const sampleComments = [
  "Ảnh đẹp quá!",
  "Tuyệt vời!",
  "Nhìn chuyên nghiệp phết!",
  "Ai chụp vậy?",
  "Có thể chia sẻ ảnh gốc không?",
  "Like mạnh!"
];

function randomUser() {
  return users[Math.floor(Math.random() * users.length)];
}

function randomComment() {
  return sampleComments[Math.floor(Math.random() * sampleComments.length)];
}

async function seed() {
  await mongoose.connection.dropCollection("photos").catch(() => {});
  await mongoose.connection.dropCollection("schemainfos").catch(() => {});

  const photos = [];

  for (let i = 0; i < 7; i++) {
    const user = users[i % users.length];
    const commentCount = Math.floor(Math.random() * 2) + 1; // 1–2 comments

    const comments = Array.from({ length: commentCount }, () => {
      const commenter = randomUser();
      return {
        comment: randomComment(),
        date_time: new Date().toISOString(),
        user: {
          _id: commenter._id,
          first_name: commenter.first_name,
          last_name: commenter.last_name
        }
      };
    });

    photos.push({
      file_name: `photo${i + 1}.jpg`,
      date_time: new Date(2025, 5, 1, 10 + i, 0, 0),
      user_id: user._id,
      comments: comments
    });
  }

  await Photo.insertMany(photos);
  await SchemaInfo.create({ version: "1.0" });

  console.log("✅ Đã tạo 7 ảnh có bình luận và 1 schemaInfo.");
  mongoose.disconnect();
}

seed();
