"use client"

import { useState, type ReactNode } from "react"
import { Bold, Italic, Search, Check } from "lucide-react"
import {
  Button,
  Card,
  Chart,
  ChartCard,
  TaskCard,
  ContentCard,
  Kbd,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  NativeSelect,
  InputOTP,
  TagInput,
  InlineEdit,
  AspectRatio,
  Separator,
  ButtonGroup,
  Carousel,
  Attachment,
  Bubble,
  BubbleContent,
  Message,
  MessageContent,
  MessageHeader,
  MessageScroller,
  Marker,
  MarkerContent,
  MarkerIcon,
  Questionnaire,
  FileUpload,
  CopyButton,
  Heading,
  Text,
  Code,
  Blockquote,
  Countdown,
  BackToTop,
} from "@aisocratic/design"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@aisocratic/design/components/accordion"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@aisocratic/design/components/alert-dialog"
import { Calendar } from "@aisocratic/design/components/calendar"
import { DatePicker } from "@aisocratic/design/components/date-picker"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@aisocratic/design/components/context-menu"
import { DirectionProvider } from "@aisocratic/design/components/direction"
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@aisocratic/design/components/drawer"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@aisocratic/design/components/hover-card"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@aisocratic/design/components/menubar"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@aisocratic/design/components/navigation-menu"
import { RadioGroup, RadioGroupItem } from "@aisocratic/design/components/radio-group"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@aisocratic/design/components/resizable"
import { Slider } from "@aisocratic/design/components/slider"
import { Toggle } from "@aisocratic/design/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "@aisocratic/design/components/toggle-group"
import inventory from "../../docs/inventory/shadcn.json"

const weekly = [
  { label: "Mon", value: 24 },
  { label: "Tue", value: 38 },
  { label: "Wed", value: 31 },
  { label: "Thu", value: 56 },
  { label: "Fri", value: 48 },
]
const devices = [
  { label: "Desktop", value: 640 },
  { label: "Mobile", value: 280 },
  { label: "Tablet", value: 80 },
]
const columns = [
  { value: "ready", label: "Ready" },
  { value: "active", label: "In progress" },
  { value: "done", label: "Done" },
]

type Example = { name: string; group: string; module: string; usage: string; content: ReactNode }

export function ComponentCatalog() {
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState("All")
  const [date, setDate] = useState<Date | undefined>()
  const [tags, setTags] = useState(["Design", "AI"])
  const [taskStatus, setTaskStatus] = useState("active")
  const [title, setTitle] = useState("A readable card title")
  const [notification, setNotification] = useState("")
  const [attached, setAttached] = useState(true)
  const [messages, setMessages] = useState(["I’ve reviewed the component library."])
  const examples: Example[] = [
    {
      name: "Task card",
      group: "Cards",
      module: "task-card",
      usage: '<TaskCard title="Review agent output" status={status} columns={columns} onStatusChange={setStatus} />',
      content: (
        <div className="space-y-3">
          <TaskCard
            title="Review agent output"
            description="Make the next step clear for the person reviewing the work."
            priority="High"
            labels={["Design", "Agent"]}
            assignee="Federico"
            status={taskStatus}
            columns={columns}
            onStatusChange={setTaskStatus}
            onOpen={() => setNotification("Task opened for review")}
            metadata={
              <>
                <span>3 subtasks</span>
                <span>2 comments</span>
              </>
            }
          />
          <TaskCard title="Update the labels" compact status="ready" labels={["UI"]} assignee="Anna" />
        </div>
      ),
    },
    {
      name: "Content card",
      group: "Cards",
      module: "content-card",
      usage: '<ContentCard title="New York chapter" eyebrow="COMMUNITY" description="Meet your local AI community." />',
      content: (
        <ContentCard
          title="New York chapter"
          eyebrow="COMMUNITY"
          description="Meet your local AI community."
          footer="Next gathering · September 24"
          media={<div className="flex size-full items-center justify-center bg-primary/10 font-body text-title text-primary">New York</div>}
        />
      ),
    },
    ...(["line", "area", "bar", "donut", "ranking", "segmented", "gauge"] as const).map((kind) => ({
      name: `${kind[0].toUpperCase() + kind.slice(1)} chart`,
      group: "Charts",
      module: "chart",
      usage: `<Chart kind="${kind}" label="Activity" data={data} />`,
      content: (
        <ChartCard
          title={
            kind === "gauge"
              ? "Quality scores"
              : kind === "line" || kind === "area" || kind === "bar"
                ? "Weekly activity"
                : "Device breakdown"
          }
          description="Sample data"
          footer="Chart colors follow the current theme."
        >
          <Chart
            kind={kind}
            label={kind + " example"}
            data={
              kind === "gauge"
                ? [
                    { label: "Performance", value: 92 },
                    { label: "Accessibility", value: 98 },
                  ]
                : ["line", "area", "bar"].includes(kind)
                  ? weekly
                  : devices
            }
          />
        </ChartCard>
      ),
    })),
    {
      name: "Accordion",
      group: "Disclosure",
      module: "accordion",
      usage:
        '<Accordion type="single" collapsible><AccordionItem value="one"><AccordionTrigger>What is Stoa?</AccordionTrigger><AccordionContent>Shared UI.</AccordionContent></AccordionItem></Accordion>',
      content: (
        <Accordion type="single" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>What is Stoa?</AccordionTrigger>
            <AccordionContent>A shared set of components for AI Socratic products.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Which font belongs on cards?</AccordionTrigger>
            <AccordionContent>Inter keeps names and labels readable.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: "Alert dialog",
      group: "Disclosure",
      module: "alert-dialog",
      usage:
        "<AlertDialog><AlertDialogTrigger asChild><Button>Archive</Button></AlertDialogTrigger><AlertDialogContent>…</AlertDialogContent></AlertDialog>",
      content: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Archive example</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Archive this example?</AlertDialogTitle>
            <AlertDialogDescription>This demonstrates a confirmation. You can cancel or confirm.</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setNotification("Example archived")}>Archive</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
    {
      name: "Calendar",
      group: "Fields",
      module: "calendar",
      usage: '<Calendar mode="single" selected={date} onSelect={setDate} />',
      content: <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 8, 1)} />,
    },
    {
      name: "Date picker",
      group: "Fields",
      module: "date-picker",
      usage: "<DatePicker value={date} onValueChange={setDate} />",
      content: <DatePicker value={date} onValueChange={setDate} />,
    },
    {
      name: "Radio group",
      group: "Fields",
      module: "radio-group",
      usage: '<RadioGroup defaultValue="daily"><label><RadioGroupItem value="daily" />Daily</label></RadioGroup>',
      content: (
        <RadioGroup defaultValue="daily" aria-label="Digest frequency">
          {["Daily", "Weekly", "Monthly"].map((label) => (
            <label key={label} className="flex items-center gap-3 text-body">
              <RadioGroupItem value={label.toLowerCase()} />
              {label}
            </label>
          ))}
        </RadioGroup>
      ),
    },
    {
      name: "Slider",
      group: "Fields",
      module: "slider",
      usage: '<Slider defaultValue={[35]} aria-label="Volume" />',
      content: (
        <div className="py-4">
          <Slider defaultValue={[35]} aria-label="Volume" />
        </div>
      ),
    },
    {
      name: "Toggle",
      group: "Fields",
      module: "toggle",
      usage: '<Toggle aria-label="Bold"><Bold /></Toggle>',
      content: (
        <Toggle aria-label="Bold">
          <Bold className="size-4" />
        </Toggle>
      ),
    },
    {
      name: "Toggle group",
      group: "Fields",
      module: "toggle-group",
      usage: '<ToggleGroup type="multiple"><ToggleGroupItem value="bold" aria-label="Bold">B</ToggleGroupItem></ToggleGroup>',
      content: (
        <ToggleGroup type="multiple" aria-label="Text formatting">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      name: "Native select",
      group: "Fields",
      module: "native-select",
      usage: '<NativeSelect aria-label="Language"><option>English</option></NativeSelect>',
      content: (
        <NativeSelect aria-label="Language">
          <option>English</option>
          <option>Italiano</option>
          <option>Español</option>
        </NativeSelect>
      ),
    },
    {
      name: "Input group",
      group: "Fields",
      module: "input-group",
      usage: '<InputGroup><InputGroupAddon>https://</InputGroupAddon><InputGroupInput aria-label="Domain" /></InputGroup>',
      content: (
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput aria-label="Domain" placeholder="aisocratic.org" />
        </InputGroup>
      ),
    },
    {
      name: "Input OTP",
      group: "Fields",
      module: "input-otp",
      usage: '<InputOTP length={6} aria-label="Verification code" />',
      content: <InputOTP length={6} placeholder="000000" />,
    },
    {
      name: "Tag input",
      group: "Fields",
      module: "tag-input",
      usage: "<TagInput value={tags} onValueChange={setTags} />",
      content: <TagInput value={tags} onValueChange={setTags} />,
    },
    {
      name: "Inline edit",
      group: "Fields",
      module: "inline-edit",
      usage: "<InlineEdit value={title} onSave={setTitle} />",
      content: <InlineEdit value={title} onSave={setTitle} />,
    },
    {
      name: "File upload",
      group: "Fields",
      module: "file-upload",
      usage: "<FileUpload multiple onFilesChange={setFiles} maxBytes={5000000} />",
      content: (
        <FileUpload
          multiple
          maxBytes={5000000}
          onFilesChange={(files) => setNotification(`${files.length} file(s) selected. Demo only.`)}
        />
      ),
    },
    {
      name: "Context menu",
      group: "Navigation",
      module: "context-menu",
      usage:
        "<ContextMenu><ContextMenuTrigger>Right-click here</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Duplicate</ContextMenuItem></ContextMenuContent></ContextMenu>",
      content: (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <button type="button" className="w-full rounded-md border border-dashed border-border p-8 text-body">
              Right-click here, or press Shift+F10
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => setNotification("Example duplicated")}>Duplicate</ContextMenuItem>
            <ContextMenuItem onSelect={() => setNotification("Link copied in demo")}>Copy link</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
    {
      name: "Menubar",
      group: "Navigation",
      module: "menubar",
      usage:
        "<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New</MenubarItem></MenubarContent></MenubarMenu></Menubar>",
      content: (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setNotification("New document created")}>New document</MenubarItem>
              <MenubarItem onSelect={() => setNotification("Document saved")}>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setNotification("Edit undone")}>Undo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ),
    },
    {
      name: "Navigation menu",
      group: "Navigation",
      module: "navigation-menu",
      usage:
        '<NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="#type">Type</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>',
      content: (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="#type">Typography</NavigationMenuLink>
                <NavigationMenuLink href="#colour">Colors</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#forms">Forms</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ),
    },
    {
      name: "Hover card",
      group: "Disclosure",
      module: "hover-card",
      usage:
        '<HoverCard><HoverCardTrigger href="#type">Inter</HoverCardTrigger><HoverCardContent>Readable UI type.</HoverCardContent></HoverCard>',
      content: (
        <HoverCard>
          <HoverCardTrigger href="#type" className="text-body underline underline-offset-4">
            Inter
          </HoverCardTrigger>
          <HoverCardContent>Our font for readable names, controls and body copy.</HoverCardContent>
        </HoverCard>
      ),
    },
    {
      name: "Drawer",
      group: "Disclosure",
      module: "drawer",
      usage:
        "<Drawer><DrawerTrigger asChild><Button>Open</Button></DrawerTrigger><DrawerContent><DrawerTitle>Details</DrawerTitle><DrawerDescription>More information.</DrawerDescription></DrawerContent></Drawer>",
      content: (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto max-w-lg space-y-4">
              <DrawerTitle>Details within reach</DrawerTitle>
              <DrawerDescription>A bottom drawer for compact tasks. Drag down or close to dismiss.</DrawerDescription>
              <DrawerClose asChild>
                <Button>Done</Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      ),
    },
    {
      name: "Resizable",
      group: "Layout",
      module: "resizable",
      usage:
        '<ResizablePanelGroup direction="horizontal"><ResizablePanel>Left</ResizablePanel><ResizableHandle /><ResizablePanel>Right</ResizablePanel></ResizablePanelGroup>',
      content: (
        <div className="h-36 overflow-hidden rounded-xl border border-border">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={20}>
              <div className="p-4 text-body">Drag the divider</div>
            </ResizablePanel>
            <ResizableHandle aria-label="Resize panels" />
            <ResizablePanel minSize={20}>
              <div className="p-4 text-body">Or focus it and use arrow keys</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ),
    },
    {
      name: "Aspect ratio",
      group: "Layout",
      module: "aspect-ratio",
      usage: "<AspectRatio ratio={16 / 9}>Media</AspectRatio>",
      content: (
        <AspectRatio ratio={16 / 9} className="flex items-center justify-center rounded-xl bg-muted font-code text-body">
          16 : 9
        </AspectRatio>
      ),
    },
    {
      name: "Separator",
      group: "Layout",
      module: "separator",
      usage: "<Separator />",
      content: (
        <div className="space-y-4 text-body">
          <p>Overview</p>
          <Separator />
          <p>Details</p>
        </div>
      ),
    },
    {
      name: "Button group",
      group: "Layout",
      module: "button-group",
      usage: '<ButtonGroup aria-label="Actions"><Button>Save</Button><Button>More</Button></ButtonGroup>',
      content: (
        <ButtonGroup aria-label="History">
          <Button variant="outline" onClick={() => setNotification("Undo")}>
            Undo
          </Button>
          <Button variant="outline" onClick={() => setNotification("Redo")}>
            Redo
          </Button>
        </ButtonGroup>
      ),
    },
    {
      name: "Kbd",
      group: "Layout",
      module: "kbd",
      usage: "<Kbd>⌘</Kbd> <Kbd>K</Kbd>",
      content: (
        <p className="flex items-center gap-2 text-body">
          Open search <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </p>
      ),
    },
    {
      name: "Item",
      group: "Layout",
      module: "item",
      usage: "<Item><ItemContent><ItemTitle>Research notes</ItemTitle></ItemContent></Item>",
      content: (
        <Item>
          <ItemContent>
            <ItemTitle>Research notes</ItemTitle>
            <ItemDescription>Updated a few minutes ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm" onClick={() => setNotification("Research notes opened")}>
              Open
            </Button>
          </ItemActions>
        </Item>
      ),
    },
    {
      name: "Direction",
      group: "Layout",
      module: "direction",
      usage: '<DirectionProvider dir="rtl"><div dir="rtl">مرحبا بالعالم</div></DirectionProvider>',
      content: (
        <DirectionProvider dir="rtl">
          <div dir="rtl" className="space-y-3 rounded-md bg-muted p-4">
            <p lang="ar" className="text-body">
              مرحبا بالعالم
            </p>
            <ToggleGroup type="single" aria-label="Alignment" defaultValue="start">
              <ToggleGroupItem value="start">Start</ToggleGroupItem>
              <ToggleGroupItem value="end">End</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </DirectionProvider>
      ),
    },
    {
      name: "Typography",
      group: "Layout",
      module: "typography",
      usage: "<Heading>Team members</Heading><Text>Readable body copy.</Text><Code>pnpm dev</Code>",
      content: (
        <div className="space-y-3">
          <Heading>Team members</Heading>
          <Text>Readable names and useful descriptions.</Text>
          <Code>pnpm dev</Code>
          <Blockquote>Make the next step clear.</Blockquote>
        </div>
      ),
    },
    {
      name: "Carousel",
      group: "Layout",
      module: "carousel",
      usage: '<Carousel label="Highlights" items={[<Card>One</Card>, <Card>Two</Card>]} />',
      content: (
        <Carousel
          label="Design principles"
          items={["Readable names", "Compact colors", "Useful examples"].map((text) => (
            <div key={text} className="flex h-32 items-center justify-center rounded-xl bg-muted p-4 font-body text-lead">
              {text}
            </div>
          ))}
        />
      ),
    },
    {
      name: "Message · Bubble · Marker",
      group: "Agent UI",
      module: "message",
      usage:
        "<Message><MessageContent><MessageHeader>Agent</MessageHeader><Bubble><BubbleContent>Ready to review.</BubbleContent></Bubble></MessageContent></Message>",
      content: (
        <div className="space-y-4">
          <Message align="end">
            <MessageContent>
              <MessageHeader>You</MessageHeader>
              <Bubble variant="primary">
                <BubbleContent>Review these changes.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Marker variant="separator">
            <MarkerContent>Today</MarkerContent>
          </Marker>
          <Message>
            <MessageContent>
              <MessageHeader>Agent</MessageHeader>
              <Bubble>
                <BubbleContent>Ready to review. The card titles use Inter.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Marker>
            <MarkerIcon>
              <Check />
            </MarkerIcon>
            <MarkerContent>Review complete</MarkerContent>
          </Marker>
        </div>
      ),
    },
    {
      name: "Message scroller",
      group: "Agent UI",
      module: "message-scroller",
      usage: "<MessageScroller>{messages}</MessageScroller>",
      content: (
        <div className="space-y-3">
          <MessageScroller className="h-44">
            {messages.map((message, i) => (
              <Bubble key={i}>
                <BubbleContent>{message}</BubbleContent>
              </Bubble>
            ))}
          </MessageScroller>
          <Button
            variant="outline"
            onClick={() => setMessages([...messages, `Update ${messages.length}: another component is ready for review.`])}
          >
            Add a message
          </Button>
        </div>
      ),
    },
    {
      name: "Attachment",
      group: "Agent UI",
      module: "attachment",
      usage: '<Attachment name="notes.pdf" description="PDF · 240 KB" onRemove={remove} />',
      content: attached ? (
        <Attachment name="notes.pdf" description="PDF · 240 KB" onRemove={() => setAttached(false)} />
      ) : (
        <Button variant="outline" onClick={() => setAttached(true)}>
          Restore attachment
        </Button>
      ),
    },
    {
      name: "Questionnaire",
      group: "Agent UI",
      module: "questionnaire",
      usage: "<Questionnaire questions={questions} onComplete={saveAnswers} />",
      content: (
        <Questionnaire
          questions={[
            {
              id: "next",
              title: "What should the agent work on?",
              type: "single",
              options: [
                { value: "cards", label: "Card layouts" },
                { value: "charts", label: "Charts" },
              ],
            },
            { id: "details", title: "Any details to include?", type: "text", optional: true },
          ]}
          onComplete={() => setNotification("Answers saved in this demo")}
        />
      ),
    },
    {
      name: "Copy button",
      group: "Utilities",
      module: "copy-button",
      usage: '<CopyButton text="pnpm add @aisocratic/design" />',
      content: <CopyButton text="pnpm add @aisocratic/design" />,
    },
    {
      name: "Countdown",
      group: "Utilities",
      module: "countdown",
      usage: '<Countdown until="2027-01-01T00:00:00Z" />',
      content: <Countdown until="2027-01-01T00:00:00Z" />,
    },
    { name: "Back to top", group: "Utilities", module: "back-to-top", usage: "<BackToTop />", content: <BackToTop /> },
  ]
  const matches = examples.filter(
    (example) =>
      (group === "All" || example.group === group) && `${example.name} ${example.group}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className="space-y-6" data-testid="component-catalog">
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search component examples"
            placeholder="Search cards, charts, controls…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <NativeSelect className="sm:w-48" aria-label="Component category" value={group} onChange={(e) => setGroup(e.target.value)}>
          {["All", ...new Set(examples.map((e) => e.group))].map((label) => (
            <option key={label}>{label}</option>
          ))}
        </NativeSelect>
      </div>
      <p className="text-micro text-muted-foreground" role="status">
        {matches.length} examples · {inventory.components.length} reference categories covered
      </p>
      {notification && (
        <p role="status" className="rounded-md bg-muted px-4 py-3 text-body">
          {notification}
        </p>
      )}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {matches.map((example) => (
          <Card key={example.name} className="min-w-0 p-5">
            <div className="mb-5">
              <p className="mb-1 font-code text-micro text-muted-foreground">{example.group}</p>
              <h3 className="font-body text-lead font-normal">{example.name}</h3>
            </div>
            <div className="min-w-0">{example.content}</div>
            <details className="mt-5 border-t border-border pt-3 text-micro">
              <summary className="cursor-pointer text-muted-foreground">How to use</summary>
              <pre className="mt-3 max-w-full overflow-x-auto rounded-md bg-muted p-3 font-code text-micro">
                <code>{`// @aisocratic/design/components/${example.module}\n${example.usage}`}</code>
              </pre>
            </details>
          </Card>
        ))}
      </div>
      {!matches.length && <p className="py-8 text-body text-muted-foreground">No matching examples. Try another name or category.</p>}
      <details className="rounded-xl border border-border p-5">
        <summary className="cursor-pointer font-body text-lead">
          Full component directory · {inventory.components.length} categories
        </summary>
        <p className="mt-3 text-body text-muted-foreground">
          Compared with{" "}
          <a href={inventory.source} className="underline">
            shadcn’s component list
          </a>
          . Names below show the Stoa export. Existing equivalents are retained.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.components.map((item) => (
            <div key={item.name} className="rounded-md bg-muted p-3">
              <p className="text-body">
                {item.name}
                <span className="ms-2 font-code text-micro text-muted-foreground">{item.status === "added" ? "New" : "Existing"}</span>
              </p>
              <p className="mt-1 break-all font-code text-micro text-muted-foreground">
                {item.symbol} · {item.module}
              </p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
