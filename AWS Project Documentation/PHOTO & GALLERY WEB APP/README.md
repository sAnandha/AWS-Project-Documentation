
# 📸 Photo Upload & Gallery Web App

## 📝 Project Description
This project is a **Photo Upload & Gallery Web App** built using **Node.js** and **AWS Services**. It allows users to upload images with a name and description. The uploaded images are stored in **Amazon S3**, metadata is stored in **DynamoDB**, and the application is hosted on **Amazon EC2**. A web interface displays the list of uploaded photos as thumbnails in a responsive table.

## 🚀 Features
- Upload photos with name and description
- Automatically display uploaded images as thumbnails
- Store image files securely in Amazon S3
- Save metadata (name, description, image URL) in DynamoDB
- Dynamically render the uploaded data on the frontend
- Deployed using Node.js on EC2 instance

## 🛠️ Tech Stack

| Layer        | Technology     |
|--------------|----------------|
| Frontend     | HTML, CSS, JavaScript (Vanilla) |
| Backend      | Node.js, Express.js |
| Database     | Amazon DynamoDB |
| File Storage | Amazon S3       |
| Hosting      | Amazon EC2 (Linux) |

## 🗂️ Project Structure

photo-web/
├── public/
│   └── index.html         # Frontend UI
├── uploads/               # Temporary storage (Multer)
├── app.js                 # Main backend logic
├── .env                   # Environment variables (bucket, table, region)
└── package.json           # Node.js dependencies

## 📦 Setup Instructions

### Step 1: AWS Resources Setup

#### ✅ Amazon S3
- Create a new bucket (e.g., `my-photo-upload-bucket`)
- Disable "Block all public access"
- Enable **Static website hosting** if you want to use S3 for frontend

#### ✅ DynamoDB
- Create a table named `photos`
- Use `id` as the partition key (type: String)

#### ✅ EC2
- Launch Amazon Linux 2 Instance
- Allow inbound rules: **HTTP (80), HTTPS (443), and SSH (22)**
- SSH into instance and install Node.js, npm, git

```
sudo yum update -y
sudo yum install git -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### Step 2: Clone and Configure Project

```
git clone https://github.com/yourusername/photo-web.git
cd photo-web
npm install
```

#### Add a `.env` file:
```
S3_BUCKET=my-photo-upload-bucket-nivas
DDB_TABLE=photos
AWS_REGION=ap-south-1
```

### Step 3: Run the Server

```
node app.js
```

Access your web app via: `http://<your-ec2-public-ip>:3000`

## 📷 How It Works
1. User fills form with **name, description**, and **image**.
2. Image is uploaded to **S3**, and public URL is generated.
3. Name, description, and image URL are saved in **DynamoDB**.
4. `/photos` API loads and renders all entries in a responsive table with thumbnails.

## 🧹 Deleting Records
To add deletion functionality, use the `id` field (UUID) and create a `/delete/:id` route that deletes from both **DynamoDB** and **S3**.

## 🎨 UI Theme
- Background: `#e9e9e0`
- Text Color: `#4d626e`
- Label/Button: `#52ca88`
- Image Name: `#696cff`

## 📌 Notes
- Make sure your EC2 instance has an IAM role with access to S3 and DynamoDB.
- Consider using **PM2** or `nohup` to run your Node app in background.

## 🏁 Future Improvements
- Add user authentication (Cognito or JWT)
- Drag-and-drop image uploads
- Pagination or infinite scroll for gallery
- Image categorization or tagging
