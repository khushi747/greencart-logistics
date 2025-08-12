const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();
const Driver = require("./models/Driver");
const Route = require("./models/Route");
const Order = require("./models/Order");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Helper function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

// Seed Drivers
const seedDrivers = async () => {
  try {
    console.log("Seeding Drivers...");

    // Clear existing drivers
    await Driver.deleteMany({});

    // Parse CSV
    const csvPath = path.join(__dirname, "data", "drivers.csv");
    const driversData = await parseCSV(csvPath);

    // Transform and insert data
    const drivers = driversData.map((row) => ({
      name: row.name,
      shift_hours: parseInt(row.shift_hours),
      past_week_hours: row.past_week_hours
        .split("|")
        .map((hours) => parseInt(hours)),
      is_active: true,
    }));

    await Driver.insertMany(drivers);
    console.log(` Inserted ${drivers.length} drivers`);
  } catch (error) {
    console.error(" Error seeding drivers:", error);
  }
};

// Seed Routes
const seedRoutes = async () => {
  try {
    console.log("Seeding Routes...");

    // Clear existing routes
    await Route.deleteMany({});

    // Parse CSV
    const csvPath = path.join(__dirname, "data", "routes.csv");
    const routesData = await parseCSV(csvPath);

    // Transform and insert data
    const routes = routesData.map((row) => ({
      route_id: parseInt(row.route_id),
      distance_km: parseInt(row.distance_km),
      traffic_level: row.traffic_level,
      base_time_min: parseInt(row.base_time_min),
      is_active: true,
    }));

    await Route.insertMany(routes);
    console.log(`Inserted ${routes.length} routes`);
  } catch (error) {
    console.error("Error seeding routes:", error);
  }
};

// Helper function to convert HH:MM to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map((num) => parseInt(num));
  return hours * 60 + minutes;
};

// Seed Orders
const seedOrders = async () => {
  try {
    console.log("Seeding Orders...");

    // Clear existing orders
    await Order.deleteMany({});

    // Parse CSV
    const csvPath = path.join(__dirname, "data", "orders.csv");
    const ordersData = await parseCSV(csvPath);

    // Transform and insert data
    const orders = ordersData.map((row) => {
      // Convert delivery_time from HH:MM format to minutes
      const deliveryTimeMinutes = timeToMinutes(row.delivery_time);

      return {
        order_id: parseInt(row.order_id),
        value_rs: parseInt(row.value_rs),
        route_id: parseInt(row.route_id),
        delivery_time: new Date(Date.now() + deliveryTimeMinutes * 60 * 1000), // Current time + delivery minutes
        simulation_id: null, // Will be set during simulation
      };
    });

    await Order.insertMany(orders);
    console.log(`Inserted ${orders.length} orders`);
  } catch (error) {
    console.error("Error seeding orders:", error);
  }
};

// Create default manager user for authentication
const seedDefaultUser = async () => {
  try {
    console.log("👤 Creating Default Manager User...");

    const User = require("./models/User"); // Assuming you have a User model
    const bcrypt = require("bcryptjs");

    // Clear existing users
    await User.deleteMany({});

    // Create default manager
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const defaultUser = new User({
      email: "manager@greencart.com",
      password: hashedPassword,
      role: "manager",
    });

    await defaultUser.save();
    console.log("Default manager created: manager@greencart.com / admin123");
  } catch (error) {
    console.error("Error creating default user:", error);
    // Don't exit if User model doesn't exist yet
    console.log("User model not found. Create it manually later.");
  }
};

// Main seeder function
const runSeeder = async () => {
  try {
    console.log(" Starting Data Seeding Process...");
    console.log("=====================================");

    // Connect to database
    await connectDB();

    // Seed all data
    await seedDrivers();
    await seedRoutes();
    await seedOrders();
    await seedDefaultUser();

    console.log("=====================================");
    console.log("All Data Seeded Successfully!");
    console.log("Database Summary:");

    // Show counts
    const driverCount = await Driver.countDocuments();
    const routeCount = await Route.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`   - Drivers: ${driverCount}`);
    console.log(`   - Routes: ${routeCount}`);
    console.log(`   - Orders: ${orderCount}`);

    console.log("=====================================");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case "drivers":
    connectDB()
      .then(seedDrivers)
      .then(() => process.exit(0));
    break;
  case "routes":
    connectDB()
      .then(seedRoutes)
      .then(() => process.exit(0));
    break;
  case "orders":
    connectDB()
      .then(seedOrders)
      .then(() => process.exit(0));
    break;
  case "clear":
    connectDB()
      .then(async () => {
        await Driver.deleteMany({});
        await Route.deleteMany({});
        await Order.deleteMany({});
        console.log("All data cleared");
      })
      .then(() => process.exit(0));
    break;
  default:
    runSeeder();
}

module.exports = { runSeeder, seedDrivers, seedRoutes, seedOrders };
