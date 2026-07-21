[CONTEXT]
Design an interactive FlowMap Canvas web application. The product bridges communication between Project Managers, Clients, and Developer teams. It allows Project Managers to visually map features and input PRD details (User Stories, Acceptance Criteria), enables Clients to provide feedback and approve modules, and automatically generates technical task breakdowns for Developers.

[OVERALL STYLE]
Visual style: Minimalist / Editorial with a highly productive feel. Mood: Professional, organized, and technical. Inspired by tools like FigJam, Whimsical, and Linear. The interface uses a generous whitespace philosophy with a subtle dotted grid background.

[SCREEN TO GENERATE]
Generate the "FlowMap Canvas with Active Drawer" screen with this layout:
- Top Header: A full-width navbar containing the workspace name, document title, stepper (Struktur -> PRD -> Task), and an "Export" button alongside the primary "Lanjutkan >" CTA.
- Main Area (Left/Center): The canvas area with the dotted pattern background, displaying the node tree.
- Active Node: One of the nodes on the canvas should be in an "Active/Selected" state.
- Right Drawer: A fixed sliding panel on the right side of the screen (occupying about 30% width or 400px) showing the detailed PRD form, discussion, and task breakdown of the selected active node.

[COMPONENTS]
Required components:
- Canvas Nodes: White cards (radius 12px) with hairline borders. Include phase badges (e.g., FASE 1). Some nodes have a small red notification badge (indicating unread comments) or a green checkmark icon (indicating approved status).
- Active Node State: The selected node has a 2px primary color (#FF6B4D) border and a subtle glow shadow `0 0 10px rgba(255, 107, 77, 0.15)`.
- Right Drawer Panel: A tall, white surface panel with a 1px left border and a subtle drop shadow bridging the canvas.
- Drawer Header: Displays the selected node's title, a phase badge, and an "X" close icon button.
- Drawer Tabs: Segmented control or text tabs for "Detail PRD", "Rekomendasi Task", and "Diskusi (2)".
- PRD Data Entry Form (inside Detail PRD tab): Clean textarea inputs for "Deskripsi Fitur", "User Story", and "Acceptance Criteria".
- Client Approval System (bottom of drawer): A distinct section featuring a prominent "Setujui Modul" button (colored green) and a status text indicating pending or approved.
- Task Breakdown UI (if Task tab is active, but show a preview card in the PRD tab): A container showing bullet points for Frontend, Backend, and QA tasks, with a "Copy Tasks" outline button.
- Comment Bubble: A small UI component inside the drawer showing a client's profile picture, name, timestamp, and their feedback text.

[DESIGN TOKENS]
Colors:
- Primary: #FF6B4D (used for primary CTA, active node border, active tab)
- Success: #10B981 (green, used for "Setujui Modul" button and approval checkmarks)
- Error/Badge: #EF4444 (red, used for unread comment badges)
- Background: #F5F5F5 (canvas)
- Grid Pattern: #E5E7EB (canvas dots)
- Surface: #FFFFFF (nodes, navbar, right drawer)
- Text-primary: #0A0A0A
- Text-secondary: #6B7280
- Border: #E5E7EB

Typography:
- Headings: Inter, weight 600. Drawer title at 18px, Node titles at 14px.
- Body: Inter, weight 400, 14px for descriptions, line-height 1.6.
- UI Labels: Inter, weight 500, 12px.

Spacing & Radius: 
- 8px grid system. Drawer padding is generous (24px).
- Drawer shape: Straight edges on the right, floating over the canvas on the left.
- Flat design dominant, rely on #E5E7EB borders for structure.

[CONTENT]
Navbar Doc Title: "Kodeflow Workspace | PT Javas - Mapping Fitur & Alur Aplikasi"
Active Node on Canvas: "Sistem Checkout" (Border: #FF6B4D, Badge: 2 unread comments)
Drawer Title: "Sistem Checkout"
Drawer Tabs: "Input PRD" (Active), "Task Developer", "Diskusi (2)"
Drawer Section 1 (Textarea Label): "User Story"
Drawer Section 1 Content: "Sebagai user, saya ingin bisa memilih metode pembayaran VA atau E-Wallet agar proses bayar lebih instan."
Drawer Section 2 (Textarea Label): "Acceptance Criteria"
Drawer Section 2 Content: "1. Dropdown payment gateway Midtrans muncul.\n2. Invoice generate otomatis setelah bayar."
Drawer Section 3 (Task Engine Preview): "Frontend: Integrasi UI Midtrans Snap. Backend: Setup webhook payment."
Drawer Section 4 (Client Approval UI): Text "Menunggu Persetujuan Klien" with a solid Success Color (#10B981) button labeled "Setujui Modul".

[INTERACTIONS]
- Drawer Overlay: The drawer sits on top of the canvas on the right side.
- Tab Switching: The active tab in the drawer has a primary color underline.
- Hover on Approval Button: The green "Setujui Modul" button slightly scales up and deepens in color.

[TECH OUTPUT]
Generate code as Next.js 15 + React 19 + Tailwind CSS v4. Use semantic HTML5. The right drawer should be a distinct, reusable component. Use Tailwind's absolute positioning for the canvas nodes and fixed positioning for the Right Drawer. Implement a structured form inside the drawer for the PRD inputs.

[RULES TO NEVER BREAK]
- Never obscure the active node on the canvas with the drawer; ensure the canvas feels like it can be panned.
- Maintain the clean, flat aesthetic—do not use heavy shadows on the drawer, a 1px left border with a very subtle blur is preferred.
- The "Setujui Modul" button must be visually distinct (using the Success color) to highlight the client's sole approval authority.