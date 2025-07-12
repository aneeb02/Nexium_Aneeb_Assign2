// Test script to verify summarization functionality
const { createSummary } = require('./src/helpers/utils.ts');

const testText = "This is a sample blog post about web development. It covers various topics including React, Next.js, and modern web technologies. The post discusses best practices for building scalable applications and provides insights into current trends in the industry.";

console.log("Original text:", testText);
console.log("Length:", testText.length);

// Test the summary function
try {
  const summary = createSummary(testText);
  console.log("\nSummary:", summary);
  console.log("Summary length:", summary.length);
} catch (error) {
  console.error("Error testing summary:", error);
}
