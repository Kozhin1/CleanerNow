# CleanerNow (Beta)

A modern web application for booking professional cleaning services. Built with React, TypeScript, Supabase, and TailwindCSS.

Built by Kozhin Fatah.

## Features

- 🧹 Book professional cleaners for various cleaning services
- 👤 User authentication and profile management
- 💬 Real-time chat between clients and cleaners
- 📍 Live location tracking during service
- ✅ Interactive cleaning checklists
- ⭐ Rating and review system
- 💳 Secure payment processing
- 📱 Responsive design for all devices
- 🔔 Real-time notifications
- 🎯 Dynamic pricing based on various factors
- 🛡️ Dispute resolution system

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast
- **Routing**: React Router
- **Payments**: Stripe

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cleanernow.git
   ```

2. Install dependencies:
   ```bash
   cd cleanernow
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── lib/             # Utility functions and configurations
├── pages/           # Page components
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.