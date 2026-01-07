const fs = require('fs-extra');
const path = require('path');

/**
 * Local Docusaurus plugin to copy raw markdown files to build output
 * Modified to output files under /docs/ path to match HTML URLs
 */

// Convert Tabs/TabItem components to readable markdown format
function convertTabsToMarkdown(content) {
  const tabsPattern = /<Tabs[^>]*>([\s\S]*?)<\/Tabs>/g;

  return content.replace(tabsPattern, (fullMatch, tabsContent) => {
    const tabItemPattern = /<TabItem\s+[^>]*value="([^"]*)"[^>]*label="([^"]*)"[^>]*>([\s\S]*?)<\/TabItem>/g;

    let result = [];
    let match;

    while ((match = tabItemPattern.exec(tabsContent)) !== null) {
      const [, value, label, itemContent] = match;

      const cleanContent = itemContent
        .split('\n')
        .map(line => line.replace(/^\s{4}/, ''))
        .join('\n')
        .trim();

      result.push(`**${label}:**\n\n${cleanContent}`);
    }

    return result.join('\n\n---\n\n');
  });
}

// Convert details/summary components to readable markdown format
function convertDetailsToMarkdown(content) {
  const detailsPattern = /<details>\s*<summary>(<strong>)?([^<]+)(<\/strong>)?<\/summary>([\s\S]*?)<\/details>/g;

  return content.replace(detailsPattern, (fullMatch, strongOpen, summaryText, strongClose, detailsContent) => {
    const cleanContent = detailsContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();

    return `### ${summaryText.trim()}\n\n${cleanContent}`;
  });
}

// Clean markdown content for raw display
function cleanMarkdownForDisplay(content, filepath) {
  const fileDir = filepath.replace(/[^/]*$/, '');

  // Strip YAML front matter
  content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

  // Remove import statements
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // Convert HTML images to markdown
  content = content.replace(
    /<p align="center">\s*\n?\s*<img src=\{require\(['"]([^'"]+)['"]\)\.default\} alt="([^"]*)"(?:\s+width="[^"]*")?\s*\/>\s*\n?\s*<\/p>/g,
    (match, imagePath, alt) => {
      const cleanPath = imagePath.replace('@site/static/', '/');
      return `![${alt}](${cleanPath})`;
    }
  );

  // Convert YouTube iframes to text links
  content = content.replace(
    /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)[^"]*"[^>]*title="([^"]*)"[^>]*>[\s\S]*?<\/iframe>/g,
    'Watch the video: [$2](https://www.youtube.com/watch?v=$1)'
  );

  // Clean HTML5 video tags
  content = content.replace(
    /<video[^>]*>\s*<source src=["']([^"']+)["'][^>]*>\s*<\/video>/g,
    '<video controls>\n  <source src="$1" type="video/mp4" />\n  <p>Video demonstration: $1</p>\n</video>'
  );

  // Remove <Head> components
  content = content.replace(/<Head>[\s\S]*?<\/Head>/g, '');

  // Convert Tabs/TabItem components
  content = convertTabsToMarkdown(content);

  // Convert details/summary components
  content = convertDetailsToMarkdown(content);

  // Convert custom React/MDX components to placeholder text
  // Instead of removing them completely, add a note about interactive content
  content = content.replace(
    /<([A-Z][a-zA-Z]*)[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g,
    (match, componentName) => {
      // Skip certain components that are purely structural
      const skipComponents = ['Head', 'FAQStructuredData', 'Admonition'];
      if (skipComponents.includes(componentName)) {
        return '';
      }
      
      // For interactive components, add a placeholder note
      const interactiveComponents = {
        'ApiExplorer': '> 🔧 **Interactive Component**: This page contains an interactive API explorer. Please visit the web page to use this feature.',
        'Tabs': '', // Already handled by convertTabsToMarkdown
        'TabItem': '',
        'CodeBlock': '', // Code blocks are usually fine
      };
      
      if (componentName in interactiveComponents) {
        return interactiveComponents[componentName];
      }
      
      // For other unknown components, add a generic note
      return `> 📦 **Component**: \`<${componentName} />\` - This is an interactive component. Please visit the web page for full functionality.`;
    }
  );

  // Convert relative image paths to absolute paths
  content = content.replace(
    /!\[([^\]]*)\]\((\.\/)?img\/([^)]+)\)/g,
    (match, alt, relPrefix, filename) => {
      return `![${alt}](/docs/${fileDir}img/${filename})`;
    }
  );

  // Remove leading blank lines
  content = content.replace(/^\s*\n/, '');

  return content;
}

// Extract 'id' or 'slug' from frontmatter
function getIdFromFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  
  // Try to match id field
  const idMatch = frontmatter.match(/^id:\s*(.+)$/m);
  if (idMatch) return idMatch[1].trim();
  
  // Try to match slug field
  const slugMatch = frontmatter.match(/^slug:\s*(.+)$/m);
  if (slugMatch) return slugMatch[1].trim().replace(/^\//, '');
  
  return null;
}

// Remove numeric prefix from filename (e.g., "1-intro.md" -> "intro.md")
function removeNumericPrefix(filename) {
  return filename.replace(/^\d+-/, '');
}

// Get the output path for a markdown file
// Uses frontmatter 'id' if available, otherwise removes numeric prefix
// Converts .mdx to .md for consistent output
function getOutputPath(relativePath, content) {
  const dir = path.dirname(relativePath);
  const filename = path.basename(relativePath);
  let ext = path.extname(filename);
  
  // Convert .mdx to .md for consistent output
  if (ext === '.mdx') {
    ext = '.md';
  }
  
  // Try to get id from frontmatter
  const id = getIdFromFrontmatter(content);
  
  if (id) {
    // Use id as filename
    return path.join(dir, id + ext);
  }
  
  // Otherwise, just remove numeric prefix from filename
  const cleanFilename = removeNumericPrefix(filename);
  // Also change extension for mdx files
  const finalFilename = cleanFilename.replace(/\.mdx$/, '.md');
  return path.join(dir, finalFilename);
}

// Recursively find all markdown files
function findMarkdownFiles(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList, baseDir);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const relativePath = path.relative(baseDir, filePath);
      fileList.push(relativePath);
    }
  });

  return fileList;
}

// Copy image directories from docs to build
async function copyImageDirectories(docsDir, buildDir) {
  const imageDirs = [];

  function findImgDirs(dir, baseDir = dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (file === 'img') {
          const relativePath = path.relative(baseDir, dir);
          imageDirs.push({ source: filePath, relativePath });
        } else {
          findImgDirs(filePath, baseDir);
        }
      }
    });
  }

  findImgDirs(docsDir);

  let copiedCount = 0;
  for (const { source, relativePath } of imageDirs) {
    // Output to /docs/ subdirectory
    const destination = path.join(buildDir, 'docs', relativePath, 'img');

    try {
      await fs.copy(source, destination);
      const imageCount = fs.readdirSync(source).length;
      console.log(`  ✓ Copied: docs/${relativePath}/img/ (${imageCount} images)`);
      copiedCount++;
    } catch (error) {
      console.error(`  ✗ Failed to copy docs/${relativePath}/img/:`, error.message);
    }
  }

  return copiedCount;
}

module.exports = function markdownSourcePlugin(context, options) {
  return {
    name: 'markdown-source-plugin-local',

    async postBuild({ outDir }) {
      const docsDir = path.join(context.siteDir, 'docs');
      // Output to /docs/ subdirectory to match HTML URLs
      const buildDir = path.join(outDir, 'docs');

      console.log('[markdown-source-plugin-local] Copying markdown source files to /docs/...');

      const mdFiles = findMarkdownFiles(docsDir);

      let copiedCount = 0;

      for (const mdFile of mdFiles) {
        const sourcePath = path.join(docsDir, mdFile);

        try {
          // Read content first to extract id/slug from frontmatter
          const content = await fs.readFile(sourcePath, 'utf8');
          
          // Get the output path (uses id from frontmatter or removes numeric prefix)
          const outputPath = getOutputPath(mdFile, content);
          const destPath = path.join(buildDir, outputPath);

          await fs.ensureDir(path.dirname(destPath));

          const cleanedContent = cleanMarkdownForDisplay(content, outputPath);

          await fs.writeFile(destPath, cleanedContent, 'utf8');
          copiedCount++;

          if (mdFile !== outputPath) {
            console.log(`  ✓ Processed: ${mdFile} → docs/${outputPath}`);
          } else {
            console.log(`  ✓ Processed: docs/${outputPath}`);
          }
        } catch (error) {
          console.error(`  ✗ Failed to process docs/${mdFile}:`, error.message);
        }
      }

      console.log(`[markdown-source-plugin-local] Successfully copied ${copiedCount} markdown files`);

      // Copy image directories
      console.log('[markdown-source-plugin-local] Copying image directories...');
      const imgDirCount = await copyImageDirectories(docsDir, outDir);
      console.log(`[markdown-source-plugin-local] Successfully copied ${imgDirCount} image directories`);
    },
  };
};

