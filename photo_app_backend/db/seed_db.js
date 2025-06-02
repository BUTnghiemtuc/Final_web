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
  comments: []
}));

const users = [
  new mongoose.Types.ObjectId("683c4d0b80a291d2884d12dc"),
  new mongoose.Types.ObjectId("683d0a9c72261b46f2d3fdd0"),
  new mongoose.Types.ObjectId("683d0b8c72261b46f2d3fdd3")
];

async function seed() {
  await mongoose.connection.dropCollection("photos").catch(() => {});
  await mongoose.connection.dropCollection("schemainfos").catch(() => {});

  const photos = [];
  for (let i = 0; i < 7; i++) {
    photos.push({
      file_name: `photo${i + 1}.jpg`,
      date_time: new Date(2025, 5, 1, 10 + i, 0, 0),
      user_id: users[i % users.length],
      comments: []
    });
  }

  await Photo.insertMany(photos);
  await SchemaInfo.create({ version: "1.0" });

  console.log("✅ Đã chèn 7 ảnh và 1 SchemaInfo");
  mongoose.disconnect();
}

seed();
