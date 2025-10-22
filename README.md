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
import { 
  CollectorPipelineView, 
  YamlEditor,
  ConfigEditorSideBySide,
  useYamlParser,
  useYamlValidation
} from '@getlawrence/ui';

// Import styles separately
import '@getlawrence/ui/styles';

function App() {
  return (
    <div>
      <CollectorPipelineView />
      <YamlEditor />
      <ConfigEditorSideBySide 
        leftContent="yaml content"
        rightContent="json content"
      />
    </div>
  );
}
```

## Available Components

### Collector Pipeline Components

- `CollectorPipelineView` - Main pipeline visualization component
- `CollectorPipelineMini` - Compact pipeline visualization

### Configuration Components

- `ConfigEditorSideBySide` - Side-by-side configuration editor
- `YamlEditor` - YAML editor with syntax highlighting

### Lawrence-Specific UI Components

- `SideBySide` - Side-by-side layout component

### Theme Provider

- `ThemeProvider` - Theme context provider
- `useTheme` - Theme hook

### Hooks

- `useYamlParser` - YAML parsing with debouncing
- `useYamlValidation` - YAML validation with error reporting

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

The components use Tailwind CSS for styling and include a shared design system. This library provides both a Tailwind preset and pre-built CSS to ensure consistent styling across projects.

### Using the Tailwind Preset

The library includes a Tailwind preset that provides shared design tokens and configuration. To use it:

1. **Install the library** (see Installation section above)

2. **Configure your Tailwind config** to use the preset:

```javascript
// tailwind.config.js
import base from '@getlawrence/ui/tailwind.preset.js'

export default {
  presets: [base],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@getlawrence/ui/**/*.{js,ts,jsx,tsx}',
  ],
  // Your additional configuration here
}
```

3. **Import the CSS** in your main entry point:

```tsx
// In your main.tsx or App.tsx
import '@getlawrence/ui/styles.css'
```

### Design Tokens

The preset includes the following design tokens:

- **Colors**: Primary, secondary, muted, accent, destructive, background, foreground, card, popover, border, input, ring
- **Border Radius**: Uses CSS variables for consistent rounded corners
- **Animations**: Accordion animations and other shared transitions

### CSS Variables

The library uses CSS variables for theming, supporting both light and dark modes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... and more */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variants */
}
```

### Customization

You can override the design tokens by providing your own CSS variables:

```css
:root {
  --primary: 220 100% 50%; /* Your custom primary color */
  --radius: 0.75rem; /* Your custom border radius */
}
```

### Without the Preset

If you prefer not to use the preset, you can still use the components by including the CSS and ensuring Tailwind is configured to scan the library files:

```css
/* In your main CSS file */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import the library styles */
@import '@getlawrence/ui/styles.css';
```

```javascript
// tailwind.config.js
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@getlawrence/ui/**/*.{js,ts,jsx,tsx}',
  ],
  // Your configuration
}
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