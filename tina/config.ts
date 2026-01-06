import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: ".",
  },
  media: {
    tina: {
      mediaRoot: "images/cars",
      publicFolder: ".",
    },
  },
  schema: {
    collections: [
      {
        name: "cars",
        label: "🚗 Car Inventory",
        path: "_cars",
        format: "md",
        fields: [
          {
            type: "string",
            name: "make",
            label: "Make",
            required: true,
          },
          {
            type: "string",
            name: "model",
            label: "Model",
            required: true,
          },
          {
            type: "number",
            name: "year",
            label: "Year",
            required: true,
          },
          {
            type: "string",
            name: "trim",
            label: "Trim / Variant",
          },
          {
            type: "number",
            name: "price",
            label: "Price (£)",
            required: true,
          },
          {
            type: "string",
            name: "availability",
            label: "Availability Status",
            required: true,
            options: [
              { value: "available", label: "✅ Available" },
              { value: "reserved", label: "⏳ Reserved" },
              { value: "sold", label: "❌ Sold" },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "⭐ Featured on Homepage",
          },
          {
            type: "number",
            name: "mileage",
            label: "Mileage",
            required: true,
          },
          {
            type: "string",
            name: "transmission",
            label: "Transmission",
            required: true,
            options: ["Automatic", "Manual", "Semi-Automatic"],
          },
          {
            type: "string",
            name: "fuelType",
            label: "Fuel Type",
            required: true,
            options: ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"],
          },
          {
            type: "string",
            name: "engineSize",
            label: "Engine Size",
          },
          {
            type: "number",
            name: "power",
            label: "Power (BHP)",
          },
          {
            type: "string",
            name: "bodyType",
            label: "Body Type",
            options: [
              "Sedan",
              "Coupe",
              "SUV",
              "Convertible",
              "Hatchback",
              "Estate",
              "Sports Car",
              "Supercar",
            ],
          },
          {
            type: "number",
            name: "doors",
            label: "Doors",
          },
          {
            type: "number",
            name: "seats",
            label: "Seats",
          },
          {
            type: "string",
            name: "color",
            label: "Exterior Color",
            required: true,
          },
          {
            type: "string",
            name: "interiorColor",
            label: "Interior Color",
          },
          {
            type: "string",
            name: "registration",
            label: "Registration Number",
          },
          {
            type: "string",
            name: "vin",
            label: "VIN",
          },
          {
            type: "object",
            name: "images",
            label: "📸 Car Images",
            list: true,
            fields: [
              {
                type: "image",
                name: "image",
                label: "Image",
              },
            ],
          },
          {
            type: "string",
            name: "features",
            label: "✨ Features",
            list: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "📝 Description",
            isBody: true,
          },
        ],
      },
    ],
  },
});
