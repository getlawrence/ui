import { useState } from 'react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider/ThemeProvider';
import { CollectorPipelineView } from '../components/collector-pipeline/CollectorPipelineView';
import { CollectorPipelineMini } from '../components/collector-pipeline/CollectorPipelineMini';
import { ConfigEditorSideBySide } from '../components/configs/ConfigEditorSideBySide';
import { YamlEditor } from '../components/editor/YamlEditor';

// Sample configurations
const sampleConfig = `
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  jaeger:
    protocols:
      grpc:
        endpoint: 0.0.0.0:14250
      thrift_http:
        endpoint: 0.0.0.0:14268

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
  memory_limiter:
    limit_mib: 512
  resource:
    attributes:
      - key: service.name
        value: my-service
        action: upsert

exporters:
  otlp:
    endpoint: https://api.honeycomb.io:443
    headers:
      "x-honeycomb-team": "your-api-key"
  logging:
    loglevel: debug

connectors:
  count: {}

service:
  pipelines:
    traces:
      receivers: [otlp, jaeger]
      processors: [memory_limiter, resource, batch]
      exporters: [otlp, logging, count]
    metrics:
      receivers: [otlp, count]
      processors: [memory_limiter, batch]
      exporters: [otlp, logging]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp, logging]
`;

const simpleConfig = `
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [logging]
`;

function GalleryContent() {
  const [selectedComponent, setSelectedComponent] = useState<string>('CollectorPipelineView');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();

  const components = {
    CollectorPipelineView: {
      name: 'CollectorPipelineView',
      description: 'Interactive pipeline visualization using React Flow',
      variants: [
        {
          name: 'Default Configuration',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px', position: 'relative' }}>
              <CollectorPipelineView
                effectiveConfig={sampleConfig}
                previewMode={false}
              />
            </div>
          )
        },
        {
          name: 'Simple Configuration',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px', position: 'relative' }}>
              <CollectorPipelineView
                effectiveConfig={simpleConfig}
                previewMode={true}
              />
            </div>
          )
        },
        {
          name: 'Empty Configuration',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px', position: 'relative' }}>
              <CollectorPipelineView
                effectiveConfig=""
                previewMode={false}
              />
            </div>
          )
        }
      ]
    },
    CollectorPipelineMini: {
      name: 'CollectorPipelineMini',
      description: 'Compact mini map view of pipeline topology',
      variants: [
        {
          name: 'Default Configuration',
          component: (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-2">
                <CollectorPipelineMini
                  effectiveConfig={sampleConfig}
                  width={400}
                  height={200}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Mini map showing pipeline topology with tiny nodes and simplified layout
              </div>
            </div>
          )
        },
        {
          name: 'Simple Configuration',
          component: (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-2">
                <CollectorPipelineMini
                  effectiveConfig={simpleConfig}
                  width={300}
                  height={150}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Simple pipeline with direct receiver to exporter connection
              </div>
            </div>
          )
        },
        {
          name: 'Empty Configuration',
          component: (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-2">
                <CollectorPipelineMini
                  effectiveConfig=""
                  width={200}
                  height={100}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Empty state when no configuration is provided
              </div>
            </div>
          )
        },
        {
          name: 'Inline Display',
          component: (
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="text-sm font-medium">Pipeline Status:</div>
              <CollectorPipelineMini
                effectiveConfig={sampleConfig}
                width={250}
                height={80}
              />
              <div className="text-xs text-muted-foreground">
                Perfect for inline display with config records
              </div>
            </div>
          )
        }
      ]
    },
    ConfigEditorSideBySide: {
      name: 'ConfigEditorSideBySide',
      description: 'Side-by-side YAML editor with live preview',
      variants: [
        {
          name: 'Default Editor',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px' }}>
              <ConfigEditorSideBySide
                value={sampleConfig}
                onChange={(_value: string) => { }}
              />
            </div>
          )
        },
        {
          name: 'Simple Editor',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px' }}>
              <ConfigEditorSideBySide
                value={simpleConfig}
                onChange={(_value: string) => { }}
              />
            </div>
          )
        },
        {
          name: 'Empty Editor',
          component: (
            <div style={{ width: '100%', height: '500px', minHeight: '500px' }}>
              <ConfigEditorSideBySide
                value=""
                onChange={(_value: string) => { }}
              />
            </div>
          )
        }
      ]
    },
    YamlEditor: {
      name: 'YamlEditor',
      description: 'Monaco-based YAML editor with syntax highlighting',
      variants: [
        {
          name: 'Default Editor',
          component: (
            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
              <YamlEditor
                value={sampleConfig}
                onChange={(_value: string) => { }}
              />
            </div>
          )
        },
        {
          name: 'Simple Editor',
          component: (
            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
              <YamlEditor
                value={simpleConfig}
                onChange={(_value: string) => { }}
              />
            </div>
          )
        },
        {
          name: 'Empty Editor',
          component: (
            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
              <YamlEditor
                value=""
                onChange={(_value: string) => { }}
              />
            </div>
          )
        }
      ]
    }
  };

  const currentComponent = components[selectedComponent as keyof typeof components];

  // Filter components based on search query
  const filteredComponents = Object.entries(components).filter(([_key, component]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query)
    );
  });


  return (
    <div className="flex h-screen font-sans bg-background text-foreground">
      {/* Compact Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} lg:w-64 bg-card border-r border-border overflow-y-auto transition-all duration-300 flex-shrink-0`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">Gallery</h1>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hidden lg:flex p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Component List */}
          <div className="space-y-1">
            <div className="space-y-1">
              {filteredComponents.map(([key, component]) => (
                <div
                  key={key}
                  className={`cursor-pointer transition-colors rounded px-2 py-2 ${selectedComponent === key
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                    }`}
                  onClick={() => {
                    setSelectedComponent(key);
                    setSelectedVariant(0);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {component.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Header */}
        <div className="bg-card border-b border-border px-4 py-3">
          {/* Mobile Menu Button and Theme Toggle */}
          <div className="lg:hidden mb-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
          {currentComponent ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {currentComponent.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {currentComponent.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {currentComponent.variants.length} variant{currentComponent.variants.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="hidden lg:flex p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                  {theme === 'light' ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">🎨</div>
              <h1 className="text-lg font-semibold text-foreground mb-1">
                Component Gallery
              </h1>
              <p className="text-sm text-muted-foreground">
                Select a component from the sidebar
              </p>
            </div>
          )}
        </div>

        {/* Variant Selector */}
        {currentComponent && currentComponent.variants.length > 1 && (
          <div className="bg-muted/20 border-b border-border px-4 py-2">
            <div className="flex gap-1">
              {currentComponent.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(index)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${selectedVariant === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground hover:bg-muted'
                    }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Component Preview */}
        <div className="flex-1 p-4 overflow-auto">
          {currentComponent ? (
            <div className="h-full bg-muted/10 rounded border p-4">
              <div className="w-full h-full">
                {currentComponent.variants[selectedVariant]?.component}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🎨</div>
                <p className="text-sm text-muted-foreground">
                  Select a component to preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryApp() {
  return (
    <ThemeProvider>
      <GalleryContent />
    </ThemeProvider>
  );
}