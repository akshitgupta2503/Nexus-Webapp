"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Build <span className="text-gradient">Faster</span>,<br />
              Scale <span className="text-gradient">Better</span>.
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              A production-ready full-stack template with Authentication, Dashboard, and a robust Backend API.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all border border-white/10 hover:border-white/20"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-400" />}
              title="Secure Authentication"
              description="JWT-based auth with password hashing and protected routes out of the box."
              delay={0.1}
            />
            <FeatureCard
              icon={<Layout className="w-8 h-8 text-purple-400" />}
              title="Modern Dashboard"
              description="Responsive dashboard interface with CRUD operations and data visualization."
              delay={0.2}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="High Performance"
              description="Built on Next.js and Node.js for maximum speed and scalability."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-2xl glass hover:bg-slate-800/50 transition-colors"
    >
      <div className="mb-4 p-3 bg-slate-800 rounded-lg inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
