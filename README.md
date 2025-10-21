# Lawrence UI Components

A collection of reusable React components for Lawrence projects, published via GitHub Packages.

## Installation

### Prerequisites

- Node.js 18 or higher
- React 18 or higher

### Install from GitHub Packages

1. Configure npm to use GitHub Packages:

```bash
# Create or update .npmrc in your project root
echo "@getlawrence:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

2. Install the package:

```bash
npm install @getlawrence/ui
```

## Quick Start

```tsx
import { CollectorPipelineView, YamlEditor } from '@getlawrence/ui';

function App() {
  return (
    <div>
      <CollectorPipelineView />
      <YamlEditor />
    </div>
  );
}
```

## Available Components

### Collector Pipeline Components

- `CollectorPipelineView` - Main pipeline visualization component
- `PipelineGenerator` - Pipeline generation utilities

### Configuration Components

- `ConfigEditorSideBySide` - Side-by-side configuration editor
- `YamlEditor` - YAML editor with syntax highlighting

### UI Components

- `Alert` - Alert notifications
- `Badge` - Status badges
- `Card` - Content cards
- `Resizable` - Resizable panels

## Usage Examples

### Collector Pipeline

```tsx
import { CollectorPipelineView } from '@lawrence/ui';

function PipelinePage() {
  const pipelineConfig = {
    // your pipeline configuration
  };

  return (
    <CollectorPipelineView 
      config={pipelineConfig}
      onConfigChange={(newConfig) => {
        // handle configuration changes
      }}
    />
  );
}
```

### YAML Editor

```tsx
import { YamlEditor } from '@lawrence/ui';

function ConfigEditor() {
  const [yamlContent, setYamlContent] = useState('');

  return (
    <YamlEditor
      value={yamlContent}
      onChange={setYamlContent}
      language="yaml"
      height="400px"
    />
  );
}
```

### Configuration Editor

```tsx
import { ConfigEditorSideBySide } from '@lawrence/ui';

function ConfigPage() {
  return (
    <ConfigEditorSideBySide
      leftContent="<!-- YAML content -->"
      rightContent="<!-- JSON content -->"
      onLeftChange={(content) => console.log('Left changed:', content)}
      onRightChange={(content) => console.log('Right changed:', content)}
    />
  );
}
```

## Styling

The components use Tailwind CSS for styling. Make sure to include Tailwind in your project:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## TypeScript Support

The package includes full TypeScript definitions. All components are properly typed and include JSDoc comments for better IDE support.

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/lawrence-ui.git
cd lawrence-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Run gallery (component showcase)
npm run gallery
```

### Building

```bash
# Build the package
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Publishing

See [PUBLISHING.md](PUBLISHING.md) for detailed publishing instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Commit Convention

We use conventional commits for automatic versioning:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- [GitHub Issues](https://github.com/your-username/lawrence-ui/issues)
- [Documentation](https://github.com/your-username/lawrence-ui#readme)
- [Changelog](CHANGELOG.md)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.