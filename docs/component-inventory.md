# Component inventory

Checked 2026-09-06 against [shadcn](https://ui.shadcn.com/docs/components) and local sibling checkouts. Stoa provides its own APIs and styling; this maps component categories, not drop-in shadcn API compatibility.

## shadcn coverage

| Reference        | Stoa module / export                   | Change   |
| ---------------- | -------------------------------------- | -------- |
| Accordion        | `accordion` / `Accordion`              | added    |
| Alert            | `alert` / `Alert`                      | existing |
| Alert Dialog     | `alert-dialog` / `AlertDialog`         | added    |
| Aspect Ratio     | `aspect-ratio` / `AspectRatio`         | added    |
| Attachment       | `attachment` / `Attachment`            | added    |
| Avatar           | `avatar` / `Avatar`                    | existing |
| Badge            | `badge` / `Badge`                      | existing |
| Breadcrumb       | `breadcrumbs` / `Breadcrumbs`          | existing |
| Bubble           | `bubble` / `Bubble`                    | added    |
| Button           | `button` / `Button`                    | existing |
| Button Group     | `button-group` / `ButtonGroup`         | added    |
| Calendar         | `calendar` / `Calendar`                | added    |
| Card             | `card` / `Card`                        | existing |
| Carousel         | `carousel` / `Carousel`                | added    |
| Chart            | `chart` / `Chart`                      | added    |
| Checkbox         | `checkbox` / `Checkbox`                | existing |
| Collapsible      | `collapsible` / `Collapsible`          | existing |
| Combobox         | `select-field` / `SelectField`         | existing |
| Command          | `command` / `Command`                  | existing |
| Context Menu     | `context-menu` / `ContextMenu`         | added    |
| Data Table       | `data-table` / `DataTable`             | existing |
| Date Picker      | `date-picker` / `DatePicker`           | added    |
| Dialog           | `dialog` / `Dialog`                    | existing |
| Direction        | `direction` / `DirectionProvider`      | added    |
| Drawer           | `drawer` / `Drawer`                    | added    |
| Dropdown Menu    | `dropdown-menu` / `DropdownMenu`       | existing |
| Empty            | `empty-state` / `EmptyState`           | existing |
| Field            | `field` / `FieldWrapper`               | existing |
| Hover Card       | `hover-card` / `HoverCard`             | added    |
| Input            | `input` / `Input`                      | existing |
| Input Group      | `input-group` / `InputGroup`           | added    |
| Input OTP        | `input-otp` / `InputOTP`               | added    |
| Item             | `item` / `Item`                        | added    |
| Kbd              | `kbd` / `Kbd`                          | added    |
| Label            | `label` / `Label`                      | existing |
| Marker           | `marker` / `Marker`                    | added    |
| Menubar          | `menubar` / `Menubar`                  | added    |
| Message          | `message` / `Message`                  | added    |
| Message Scroller | `message-scroller` / `MessageScroller` | added    |
| Native Select    | `native-select` / `NativeSelect`       | added    |
| Navigation Menu  | `navigation-menu` / `NavigationMenu`   | added    |
| Pagination       | `pagination` / `PaginationControls`    | existing |
| Popover          | `popover` / `Popover`                  | existing |
| Progress         | `progress` / `Progress`                | existing |
| Questionnaire    | `questionnaire` / `Questionnaire`      | added    |
| Radio Group      | `radio-group` / `RadioGroup`           | added    |
| Resizable        | `resizable` / `ResizablePanelGroup`    | added    |
| Scroll Area      | `scroll-area` / `ScrollArea`           | existing |
| Select           | `select` / `Select`                    | existing |
| Separator        | `separator` / `Separator`              | added    |
| Sheet            | `sheet` / `Sheet`                      | existing |
| Sidebar          | `admin-shell` / `AdminShell`           | existing |
| Skeleton         | `skeleton` / `Skeleton`                | existing |
| Slider           | `slider` / `Slider`                    | added    |
| Spinner          | `spinner` / `Spinner`                  | existing |
| Switch           | `switch` / `Switch`                    | existing |
| Table            | `table` / `Table`                      | existing |
| Tabs             | `tabs` / `Tabs`                        | existing |
| Textarea         | `textarea` / `Textarea`                | existing |
| Toast            | `sonner` / `Toaster`                   | existing |
| Toggle           | `toggle` / `Toggle`                    | added    |
| Toggle Group     | `toggle-group` / `ToggleGroup`         | added    |
| Tooltip          | `tooltip` / `Tooltip`                  | existing |
| Typography       | `typography` / `Heading`               | added    |

All modules are available at `@aisocratic/design/components/<module>`. Combobox is `SelectField searchable`; its `multiple` mode covers searched multi-selection. Sidebar uses the existing responsive AdminShell. Typography uses Heading/Text/Code/Blockquote plus the existing editorial/page primitives.

## Local sources

The JSON snapshots list local React component files and named exports. UI presentation is extracted; routing, auth, database access, task dispatch, upload transport and analytics collectors remain application responsibilities.

- `website`: 257 React files; full paths and exports in [the snapshot](inventory/website.json).
- `agora`: 15 React files; full paths and exports in [the snapshot](inventory/agora.json).
- `atlas`: 21 React files; full paths and exports in [the snapshot](inventory/atlas.json).

| Source pattern                         | Stoa result                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| website UI primitives and admin chrome | Existing controls retained; added Calendar, DatePicker, InlineEdit, TagInput, FileUpload, CopyButton, Countdown, BackToTop |
| website event, blog and chapter cards  | ContentCard with optional media, metadata, footer and editorial heading                                                    |
| website avatar/image upload            | FileUpload accepts image selection; apps own upload and preview/storage lifecycle                                          |
| website image lightboxes               | Compose existing Dialog with an image; no router or image host coupling                                                    |
| Agora SortableCard / focus rows        | TaskCard with compact layout, priority, assignee, labels, selection styling, move control and action slots                 |
| Agora drag-and-drop and dispatch       | Application integration; TaskCard intentionally owns presentation only                                                     |
| Atlas telemetry and chart shell        | ChartCard and existing MetricCard / Table                                                                                  |
| Atlas basic analytics                  | Chart supports line, area, bar, donut, ranking, segmented and gauge                                                        |

## Chart behavior

Charts accept `{ label, value, color? }[]`, use Stoa chart colors, include an accessible data table, and show an empty state. Line/area/bar support signed numbers. Share charts treat negative contributions as zero; gauges clamp to 0–100. Line and area are single-series charts. Interactive multi-series dashboards remain app compositions.

## Dependency policy

Radix wrappers, Calendar/DatePicker, Drawer and Resizable are subpath imports with optional peers. Install their dependencies only when using those modules. They are installed in the gallery for previews. No optional dependency is exported from the root barrel.
