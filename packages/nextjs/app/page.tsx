"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ClipboardDocumentListIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kudos
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-purple-200 mb-4 font-medium">
              A Distributed Gratitude Protocol
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Create a decentralized social infrastructure for expressing and propagating gratitude through
              blockchain-native tokens, inspired by the Indigenous wampum system&apos;s role in binding social
              relationships, recording commitments, and transferring obligations/honors across a community network.
            </p>
            {connectedAddress && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <p className="text-gray-300 font-medium">Connected Address:</p>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-12 border-4 border-orange-400/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center justify-center">
            <span className="text-orange-400 mr-3">💫</span>
            Core Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-black/40 rounded-lg p-4 sm:p-6">
              <p className="text-orange-300 font-bold mb-2 text-lg sm:text-xl">
                🌱 Gratitude should spread, not be hoarded
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                When you receive gratitude, you can share it without losing it. Gratitude multiplies instead of
                transferring.
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 sm:p-6">
              <p className="text-orange-300 font-bold mb-2 text-lg sm:text-xl">📜 Each token tells a unique story</p>
              <p className="text-gray-300 text-sm sm:text-base">
                Metadata preserves the narrative behind each gratitude, ensuring the context and meaning are never lost.
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 sm:p-6">
              <p className="text-orange-300 font-bold mb-2 text-lg sm:text-xl">🕸️ Distribution creates networks</p>
              <p className="text-gray-300 text-sm sm:text-base">
                Track how gratitude spreads through communities, building interconnected networks of appreciation and
                acknowledgment.
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 sm:p-6">
              <p className="text-orange-300 font-bold mb-2 text-lg sm:text-xl">🎁 Wampum-inspired reciprocity</p>
              <p className="text-gray-300 text-sm sm:text-base">
                Binding relationships through shared acknowledgment, inspired by Indigenous wampum traditions of
                reciprocity and community.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-blue-200 mb-3">Propagation Model</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Gratitude spreads without loss. When you propagate kudos, you keep your token while sharing it with others
              - creating exponential networks of appreciation.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <div className="text-4xl mb-4">🪶</div>
            <h3 className="text-xl font-bold text-green-200 mb-3">Wampum-Inspired</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Rooted in Indigenous wampum traditions of binding relationships, recording commitments, and transferring
              honors across community networks.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/30">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-purple-200 mb-3">Anti-Speculation</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Built to preserve intrinsic value. Transfers are disabled by default, ensuring gratitude remains a social
              good, not a financial asset.
            </p>
          </div>
        </div>

        {/* Call to Action Cards */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 mb-12 border border-white/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/contract"
              className="flex flex-col items-center bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 sm:p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all hover:scale-105"
            >
              <ClipboardDocumentListIcon className="h-12 w-12 text-blue-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-blue-200 mb-2">View Contract</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center">
                Explore the Kudos smart contract documentation and implementation
              </p>
            </Link>
            <Link
              href="/debug"
              className="flex flex-col items-center bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl p-6 sm:p-8 border border-green-400/30 hover:border-green-400/60 transition-all hover:scale-105"
            >
              <SparklesIcon className="h-12 w-12 text-green-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-green-200 mb-2">Create Kudos</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center">
                Create and propagate gratitude tokens through the network
              </p>
            </Link>
            <Link
              href="/blockexplorer"
              className="flex flex-col items-center bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 sm:p-8 border border-orange-400/30 hover:border-orange-400/60 transition-all hover:scale-105"
            >
              <HeartIcon className="h-12 w-12 text-orange-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-orange-200 mb-2">Explore Network</h3>
              <p className="text-gray-300 text-sm sm:text-base text-center">
                Track gratitude propagation and explore the gratitude network
              </p>
            </Link>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-purple-400 mr-3">💼</span>
            Perfect For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">🏛️ DAOs & Web3 Communities</p>
              <p className="text-gray-300 text-sm">Recognize contributions and build reputation networks</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">📚 Education & Mentorship</p>
              <p className="text-gray-300 text-sm">Track mentorship chains and build learning networks</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">💻 Open Source Projects</p>
              <p className="text-gray-300 text-sm">Acknowledge contributors and track collaboration</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">🌍 Cultural Communities</p>
              <p className="text-gray-300 text-sm">Maintain gift economies and preserve traditions</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">❤️ Non-Profit Organizations</p>
              <p className="text-gray-300 text-sm">Recognize volunteers and track impact networks</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-purple-300 font-bold mb-2">🎨 Creative Collaborations</p>
              <p className="text-gray-300 text-sm">Build artistic communities through gratitude</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
