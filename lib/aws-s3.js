import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ 
  region: process.env.AWS_REGION || 'us-east-2' 
});

export async function getObjectText(bucket, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    const response = await s3.send(command);
    const bodyContents = await response.Body?.transformToString();
    return bodyContents || '';
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return '';
    }
    throw error;
  }
}

export async function putObjectText(bucket, key, body) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'application/json',
  });
  
  await s3.send(command);
} 