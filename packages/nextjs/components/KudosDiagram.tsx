import React from "react";

interface CardProps {
  title: string;
  value: string;
  description: string;
  gradient: string;
}

interface StateVariableProps {
  name: string;
  type: string;
  description: string;
  purpose: string;
  example?: string;
  gradient: string;
  borderColor: string;
  isKeyFeature?: boolean;
}

interface EventProps {
  name: string;
  description: string;
  parameters: string[];
  gradient: string;
  borderColor: string;
}

interface FunctionProps {
  name: string;
  description: string;
  parameters?: Array<{ type: string; name: string; description: string }>;
  returns?: Array<{ type: string; description: string }>;
  workflow?: string[];
  restrictions?: string[];
  gradient: string;
  borderColor: string;
  visibility: "public" | "private" | "internal" | "external";
  isKeyFeature?: boolean;
}

interface ViewFunctionProps {
  name: string;
  description: string;
  returns: string;
  notes: string;
  gradient: string;
  borderColor: string;
}

interface ConceptProps {
  title: string;
  description: string;
  example: string;
  notes: string;
  gradient: string;
  borderColor: string;
}

interface FeatureProps {
  title: string;
  icon: string;
  items: string[];
  gradient: string;
  borderColor: string;
}

const OverviewCard: React.FC<CardProps> = ({ title, value, description, gradient }) => (
  <div className={`${gradient} backdrop-blur-lg rounded-xl p-6 border border-white/30`}>
    <h3 className="text-xl font-bold text-blue-200 mb-3">{title}</h3>
    <p className="text-white">{value}</p>
    <p className="text-blue-300 text-sm mt-2">{description}</p>
  </div>
);

const StateVariable: React.FC<StateVariableProps> = ({
  name,
  type,
  description,
  purpose,
  example,
  gradient,
  borderColor,
  isKeyFeature = false,
}) => (
  <div className={`${gradient} rounded-xl p-6 border-l-4 ${borderColor} ${isKeyFeature ? "border-4" : ""}`}>
    <div className="flex justify-between items-start mb-3">
      <h4 className="text-xl font-bold text-yellow-200">
        {name} {isKeyFeature && "⭐"}
      </h4>
      <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">{type}</span>
    </div>
    <p className="text-gray-300 mb-3">{description}</p>
    <div className="bg-black/30 rounded-lg p-3">
      <p className="text-green-400 text-sm font-mono">Purpose:</p>
      <p className="text-white text-sm">{purpose}</p>
      {example && <p className="text-purple-300 text-xs mt-2">{example}</p>}
    </div>
  </div>
);

const Event: React.FC<EventProps> = ({ name, description, parameters, gradient, borderColor }) => (
  <div className={`${gradient} rounded-xl p-6 border-l-4 ${borderColor}`}>
    <h4 className="text-xl font-bold text-green-200 mb-2">{name}</h4>
    <p className="text-gray-300 mb-3">{description}</p>
    <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
      <p className="text-green-400">event {name}(</p>
      {parameters.map((param, idx) => (
        <p key={idx} className="text-white ml-4">
          {param}
          {idx < parameters.length - 1 ? "," : ""}
        </p>
      ))}
      <p className="text-green-400">)</p>
    </div>
  </div>
);

const FunctionCard: React.FC<FunctionProps> = ({
  name,
  description,
  parameters,
  returns,
  workflow,
  restrictions,
  gradient,
  borderColor,
  visibility,
  isKeyFeature = false,
}) => (
  <div className={`${gradient} rounded-xl p-6 border ${borderColor} ${isKeyFeature ? "border-4" : ""}`}>
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-2xl font-bold text-blue-200">
        {name} {isKeyFeature && "🔥"}
      </h4>
      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{visibility}</span>
    </div>
    <p className="text-gray-300 mb-4">{description}</p>

    {parameters && parameters.length > 0 && (
      <div className="bg-black/40 rounded-lg p-4 mb-4">
        <p className="text-yellow-400 font-mono text-sm mb-2">Parameters:</p>
        <ul className="space-y-1 text-sm">
          {parameters.map((param, idx) => (
            <li key={idx} className="text-white">
              • <span className="text-purple-300">{param.type}</span> {param.name} - {param.description}
            </li>
          ))}
        </ul>
      </div>
    )}

    {returns && returns.length > 0 && (
      <div className="bg-black/40 rounded-lg p-4 mb-4">
        <p className="text-yellow-400 font-mono text-sm mb-2">Returns:</p>
        {returns.map((ret, idx) => (
          <p key={idx} className="text-white text-sm">
            • <span className="text-purple-300">{ret.type}</span> {ret.description}
          </p>
        ))}
      </div>
    )}

    {workflow && workflow.length > 0 && (
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border-l-4 border-orange-400">
        <p className="text-orange-300 font-bold mb-2">🎯 Workflow Example:</p>
        <div className="space-y-1 text-sm">
          {workflow.map((step, idx) => (
            <p key={idx} className="text-gray-300">
              {step}
            </p>
          ))}
        </div>
      </div>
    )}

    {restrictions && restrictions.length > 0 && (
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border-l-4 border-yellow-400 mt-4">
        <p className="text-yellow-300 font-bold mb-2">⚠️ Restrictions:</p>
        <div className="space-y-1 text-sm">
          {restrictions.map((restriction, idx) => (
            <p key={idx} className="text-gray-300">
              {restriction}
            </p>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ViewFunction: React.FC<ViewFunctionProps> = ({ name, description, returns, notes, gradient, borderColor }) => (
  <div className={`${gradient} rounded-xl p-6 border ${borderColor}`}>
    <h4 className="text-xl font-bold text-cyan-200 mb-2">{name}</h4>
    <p className="text-gray-300 text-sm mb-3">{description}</p>
    <div className="bg-black/30 rounded-lg p-3 text-xs">
      <p className="text-cyan-300">Returns: {returns}</p>
      <p className="text-gray-400 mt-2">{notes}</p>
    </div>
  </div>
);

const Concept: React.FC<ConceptProps> = ({ title, description, example, notes, gradient, borderColor }) => (
  <div className={`${gradient} rounded-xl p-6 border-l-4 ${borderColor}`}>
    <h4 className="text-xl font-bold text-yellow-200 mb-3">{title}</h4>
    <p className="text-gray-300 text-sm mb-2">{description}</p>
    <p className="text-yellow-300 text-xs">{example}</p>
    <p className="text-gray-400 text-xs mt-2">{notes}</p>
  </div>
);

const FeatureCard: React.FC<FeatureProps> = ({ title, icon, items, gradient, borderColor }) => (
  <div className={`${gradient} rounded-xl p-5 border-l-4 ${borderColor}`}>
    <h4 className="text-lg font-bold text-blue-200 mb-2">
      {icon} {title}
    </h4>
    <ul className="space-y-1 text-sm text-gray-300">
      {items.map((item, idx) => (
        <li key={idx}>• {item}</li>
      ))}
    </ul>
  </div>
);

const KudosDiagram: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">Kudos - Distributed Gratitude Protocol</h1>
          <p className="text-purple-200 text-lg">
            ERC-1155 Semi-Fungible Token Implementation for Gratitude Propagation
          </p>
          <p className="text-orange-300 text-sm mt-2">✨ Inspired by Indigenous Wampum Systems ✨</p>
        </div>

        {/* Contract Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <OverviewCard
            title="📋 Contract Type"
            value="ERC-1155 Multi-Token"
            description="Semi-Fungible Token (SFT)"
            gradient="bg-gradient-to-br from-blue-600/20 to-blue-800/20"
          />
          <OverviewCard
            title="🙏 Use Case"
            value="Gratitude Propagation"
            description="Gratitude spreads without loss"
            gradient="bg-gradient-to-br from-green-600/20 to-green-800/20"
          />
          <OverviewCard
            title="🔐 Inheritance"
            value="ERC1155 + Ownable + ReentrancyGuard"
            description="OpenZeppelin 5.0.2 contracts"
            gradient="bg-gradient-to-br from-purple-600/20 to-purple-800/20"
          />
        </div>

        {/* Core Philosophy */}
        <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border-4 border-orange-400/50">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-orange-400 mr-3">💫</span>
            Core Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-orange-300 font-bold mb-2">🌱 Gratitude should spread, not be hoarded</p>
              <p className="text-gray-300 text-sm">When you receive gratitude, you can share it without losing it</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-orange-300 font-bold mb-2">📜 Each token tells a unique story</p>
              <p className="text-gray-300 text-sm">Metadata preserves the narrative behind each gratitude</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-orange-300 font-bold mb-2">🕸️ Distribution creates networks</p>
              <p className="text-gray-300 text-sm">Track how gratitude spreads through communities</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-orange-300 font-bold mb-2">🎁 Wampum-inspired reciprocity</p>
              <p className="text-gray-300 text-sm">Binding relationships through shared acknowledgment</p>
            </div>
          </div>
        </div>

        {/* State Variables Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-yellow-400 mr-3">💾</span>
            State Variables
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StateVariable
              name="_tokenIdCounter"
              type="uint256"
              description="Counter for generating unique token IDs"
              purpose="Increments for each new Kudos token created"
              example="Starts at 0, increments for each gratitude"
              gradient="bg-gradient-to-r from-yellow-900/30 to-orange-900/30"
              borderColor="border-yellow-400"
            />

            <StateVariable
              name="kudosData"
              type="mapping(uint256 → KudosMetadata)"
              description="Complete metadata for each Kudos token"
              purpose="Stores story, creator, supply limits, settings, and media URI per token"
              example={`kudosData[1].story = 'Thank you for helping me'; kudosData[1].mediaUri = 'ipfs://QmXxx...'`}
              gradient="bg-gradient-to-r from-blue-900/30 to-indigo-900/30"
              borderColor="border-blue-400"
              isKeyFeature={true}
            />

            <StateVariable
              name="propagationHistory"
              type="mapping(uint256 → PropagationRecord[])"
              description="Complete propagation graph for each token"
              purpose="⚡ KEY FEATURE: Records who received from whom, creating the gratitude network. Enables visualization of how gratitude spreads through community."
              example="propagationHistory[1] = [Alice→Bob, Bob→Charlie, Alice→Diana]"
              gradient="bg-gradient-to-r from-purple-900/30 to-pink-900/30"
              borderColor="border-purple-400"
              isKeyFeature={true}
            />

            <StateVariable
              name="holderGeneration"
              type="mapping(uint256 → mapping(address → uint256))"
              description="How many 'hops' each holder is from creator"
              purpose="Tracks degrees of separation. Creator = 0, first recipient = 1, their recipient = 2, etc."
              example="holderGeneration[1][Alice] = 0 (creator), holderGeneration[1][Bob] = 1"
              gradient="bg-gradient-to-r from-green-900/30 to-teal-900/30"
              borderColor="border-green-400"
            />

            <StateVariable
              name="firstReceiptTime"
              type="mapping(uint256 → mapping(address → uint256))"
              description="Timestamp when address first received token"
              purpose="Preserves historical record of when gratitude was first received"
              gradient="bg-gradient-to-r from-red-900/30 to-pink-900/30"
              borderColor="border-red-400"
            />

            <StateVariable
              name="creatorTokens"
              type="mapping(address → uint256[])"
              description="All token IDs created by an address"
              purpose="Quick lookup of all gratitude tokens someone has created"
              gradient="bg-gradient-to-r from-indigo-900/30 to-purple-900/30"
              borderColor="border-indigo-400"
            />

            <StateVariable
              name="holderTokens"
              type="mapping(address → uint256[])"
              description="All token IDs held by an address"
              purpose="Quick lookup of all gratitude tokens someone has received"
              gradient="bg-gradient-to-r from-cyan-900/30 to-blue-900/30"
              borderColor="border-cyan-400"
            />
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-green-400 mr-3">📡</span>
            Events (Blockchain Logging)
          </h2>

          <div className="space-y-4">
            <Event
              name="KudosCreated"
              description="Emitted when new Kudos token is created"
              parameters={[
                "uint256 indexed tokenId",
                "address indexed creator",
                "string story",
                "uint256 maxSupply",
                "uint256 timestamp",
              ]}
              gradient="bg-gradient-to-r from-green-900/30 to-emerald-900/30"
              borderColor="border-green-400"
            />

            <Event
              name="KudosPropagated"
              description="Emitted when gratitude spreads to new recipient"
              parameters={[
                "uint256 indexed tokenId",
                "address indexed from",
                "address indexed to",
                "uint256 generation",
                "uint256 timestamp",
              ]}
              gradient="bg-gradient-to-r from-blue-900/30 to-cyan-900/30"
              borderColor="border-blue-400"
            />

            <Event
              name="KudosTransferred"
              description="Emitted on traditional transfer (optional)"
              parameters={[
                "uint256 indexed tokenId",
                "address indexed from",
                "address indexed to",
                "uint256 amount",
                "uint256 timestamp",
              ]}
              gradient="bg-gradient-to-r from-purple-900/30 to-pink-900/30"
              borderColor="border-purple-400"
            />

            <Event
              name="PropagationSettingsUpdated"
              description="Emitted when creator updates token settings"
              parameters={["uint256 indexed tokenId", "bool canPropagate", "bool transferable"]}
              gradient="bg-gradient-to-r from-orange-900/30 to-red-900/30"
              borderColor="border-orange-400"
            />
          </div>
        </div>

        {/* Core Functions Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-blue-400 mr-3">⚙️</span>
            Core Functions - Gratitude Creation & Propagation ⭐
          </h2>

          <div className="space-y-6">
            <FunctionCard
              name="createKudos()"
              description="Create a new Kudos token to express gratitude. Creator keeps their copy while sharing with others."
              parameters={[
                { type: "string", name: "story", description: "The narrative behind this gratitude" },
                { type: "uint256", name: "maxSupply", description: "Maximum number of copies that can exist" },
                { type: "address[]", name: "initialRecipients", description: "First recipients of this gratitude" },
                { type: "string", name: "visualSymbol", description: "Cultural/visual identifier (wampum-inspired)" },
                {
                  type: "string",
                  name: "mediaUri",
                  description: "URI pointing to artwork, image, or other media (IPFS recommended)",
                },
                { type: "bool", name: "_canPropagate", description: "Can holders distribute to others?" },
                { type: "bool", name: "_transferable", description: "Are traditional transfers allowed?" },
              ]}
              returns={[{ type: "uint256", description: "tokenId - The newly created token ID" }]}
              workflow={[
                '1️⃣ Alice: createKudos("Thank you Bob for help!", 100, [Bob, Charlie], "purple", "ipfs://QmXxx...", true, false)',
                "2️⃣ Alice receives token #1 (generation 0 - creator)",
                "3️⃣ Bob receives token #1 (generation 1 - from Alice)",
                "4️⃣ Charlie receives token #1 (generation 1 - from Alice)",
                "5️⃣ All three now hold token #1 and can propagate further!",
              ]}
              restrictions={[
                "• Story cannot be empty",
                "• maxSupply must be > 0",
                "• initialRecipients.length ≤ maxSupply",
                "• Uses nonReentrant modifier for security",
              ]}
              gradient="bg-gradient-to-br from-blue-900/40 to-purple-900/40"
              borderColor="border-blue-400/30"
              visibility="external"
              isKeyFeature={true}
            />

            <FunctionCard
              name="propagateKudos()"
              description="THE CORE FEATURE! Spread gratitude to new recipients WITHOUT losing your token. This is the propagation model."
              parameters={[
                { type: "uint256", name: "tokenId", description: "Which Kudos token to propagate" },
                { type: "address[]", name: "recipients", description: "Array of addresses to receive gratitude" },
              ]}
              workflow={[
                "1️⃣ Bob has token #1 (received from Alice, generation 1)",
                "2️⃣ Bob: propagateKudos(1, [Diana, Eve])",
                "3️⃣ Diana receives token #1 (generation 2 - from Bob)",
                "4️⃣ Eve receives token #1 (generation 2 - from Bob)",
                "5️⃣ Bob STILL HAS token #1! (This is the magic!)",
                "6️⃣ Diana and Eve can now propagate further...",
                "Result: Gratitude network grows exponentially! 🌐",
              ]}
              restrictions={[
                "• Token must have canPropagate = true",
                "• Caller must hold the token",
                "• Cannot propagate to yourself",
                "• Must respect maxSupply limit",
                "• Uses nonReentrant modifier for security",
              ]}
              gradient="bg-gradient-to-br from-orange-900/40 to-red-900/40"
              borderColor="border-orange-400/50"
              visibility="external"
              isKeyFeature={true}
            />

            <FunctionCard
              name="traditionalTransfer()"
              description="Optional: Traditional transfer where sender LOSES their token. Disabled by default (anti-speculation)."
              parameters={[
                { type: "address", name: "from", description: "Address to transfer from" },
                { type: "address", name: "to", description: "Address to transfer to" },
                { type: "uint256", name: "tokenId", description: "Which token to transfer" },
                { type: "uint256", name: "amount", description: "How many to transfer" },
              ]}
              restrictions={[
                "⚠️ Token must have transferable = true",
                "⚠️ Sender loses their token (unlike propagation)",
                "⚠️ Use this ONLY if token creator enabled it",
              ]}
              gradient="bg-gradient-to-br from-yellow-900/40 to-orange-900/40"
              borderColor="border-yellow-400/30"
              visibility="external"
            />
          </div>
        </div>

        {/* View Functions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-cyan-400 mr-3">👁️</span>
            View Functions (Read-Only)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViewFunction
              name="getPropagationNetwork()"
              description="Get complete propagation graph for a token"
              returns="PropagationRecord[] - All propagation events"
              notes="Use this to visualize the gratitude network!"
              gradient="bg-gradient-to-br from-purple-900/30 to-pink-900/30"
              borderColor="border-purple-400/30"
            />

            <ViewFunction
              name="getHolderGeneration()"
              description="Get how many 'hops' a holder is from creator"
              returns="uint256 - Generation number (0 = creator)"
              notes="0 = creator, 1 = first recipient, 2 = their recipient..."
              gradient="bg-gradient-to-br from-green-900/30 to-teal-900/30"
              borderColor="border-green-400/30"
            />

            <ViewFunction
              name="getCreatorTokens()"
              description="Get all tokens created by an address"
              returns="uint256[] - Array of token IDs"
              notes="Quick lookup of someone's gratitude creations"
              gradient="bg-gradient-to-br from-blue-900/30 to-indigo-900/30"
              borderColor="border-blue-400/30"
            />

            <ViewFunction
              name="getHolderTokens()"
              description="Get all tokens held by an address"
              returns="uint256[] - Array of token IDs"
              notes="See all gratitude someone has received"
              gradient="bg-gradient-to-br from-cyan-900/30 to-blue-900/30"
              borderColor="border-cyan-400/30"
            />

            <ViewFunction
              name="getKudosMetadata()"
              description="Get complete metadata for a token"
              returns="KudosMetadata - Full struct with story, creator, supply, etc."
              notes="One call to get all token info"
              gradient="bg-gradient-to-br from-orange-900/30 to-red-900/30"
              borderColor="border-orange-400/30"
            />

            <ViewFunction
              name="getKudosReach()"
              description="Calculate the 'reach' of a kudos"
              returns="uint256 - Total unique holders (currentSupply)"
              notes="How many people have received this gratitude?"
              gradient="bg-gradient-to-br from-yellow-900/30 to-orange-900/30"
              borderColor="border-yellow-400/30"
            />

            <ViewFunction
              name="getMaxPropagationDepth()"
              description="Get maximum propagation depth"
              returns="uint256 - Longest chain from creator"
              notes="How far has this gratitude spread?"
              gradient="bg-gradient-to-br from-indigo-900/30 to-purple-900/30"
              borderColor="border-indigo-400/30"
            />

            <ViewFunction
              name="getCurrentTokenId()"
              description="Get current token ID counter"
              returns="uint256 - Next token ID to be minted"
              notes="Total Kudos tokens created so far"
              gradient="bg-gradient-to-br from-red-900/30 to-pink-900/30"
              borderColor="border-red-400/30"
            />
          </div>
        </div>

        {/* Admin Functions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-red-400 mr-3">🔐</span>
            Admin Functions
          </h2>

          <div className="space-y-6">
            <FunctionCard
              name="updatePropagationSettings()"
              description="Update propagation/transfer settings for a token (creator only)"
              parameters={[
                { type: "uint256", name: "tokenId", description: "Which token to update" },
                { type: "bool", name: "_canPropagate", description: "New propagation setting" },
                { type: "bool", name: "_transferable", description: "New transferable setting" },
              ]}
              restrictions={["⚠️ Only token creator can call"]}
              gradient="bg-gradient-to-br from-red-900/40 to-orange-900/40"
              borderColor="border-red-400/30"
              visibility="external"
            />

            <FunctionCard
              name="setURI()"
              description="Update base URI for token metadata (owner only)"
              parameters={[{ type: "string", name: "newuri", description: "New base URI" }]}
              restrictions={["⚠️ Only contract owner can call"]}
              gradient="bg-gradient-to-br from-indigo-900/40 to-blue-900/40"
              borderColor="border-indigo-400/30"
              visibility="external"
            />
          </div>
        </div>

        {/* Propagation vs Transfer Concept */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border-4 border-purple-400/50">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-purple-400 mr-3">🎭</span>
            Propagation Model vs Traditional Transfer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Concept
              title="🌟 Propagation (Default)"
              description="Gratitude spreads without loss"
              example="Alice has token → propagates to Bob → Alice STILL HAS token, Bob ALSO HAS token"
              notes="This is the core innovation - gratitude multiplies instead of transferring!"
              gradient="bg-gradient-to-br from-purple-900/30 to-pink-900/30"
              borderColor="border-purple-400"
            />

            <Concept
              title="🔄 Traditional Transfer (Optional)"
              description="Traditional ownership transfer"
              example="Alice has token → transfers to Bob → Alice LOSES token, Bob GETS token"
              notes="Disabled by default. Creator can enable if needed (anti-speculation design)"
              gradient="bg-gradient-to-br from-yellow-900/30 to-orange-900/30"
              borderColor="border-yellow-400"
            />
          </div>

          <div className="mt-6 bg-black/40 rounded-xl p-6">
            <h4 className="text-xl font-bold text-purple-200 mb-4">🎯 Real-World Analogy: Wampum Belt</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔷</span>
                <div>
                  <p className="text-white font-semibold">Propagation = Sharing Stories</p>
                  <p className="text-gray-400 text-sm">
                    When you tell someone a story, you both know it. The story doesn&#39;t leave you - it spreads!
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="text-white font-semibold">Transfer = Giving Away Physical Object</p>
                  <p className="text-gray-400 text-sm">
                    Like giving someone a physical belt - you lose it, they gain it. This is optional and discouraged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wampum-Inspired Features */}
        <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-green-400/30">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-green-400 mr-3">🪶</span>
            Wampum-Inspired Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Ceremonial Functions"
              icon="🌿"
              items={[
                "Binding Commitments: Tokens represent mutual obligations",
                "Name/Title Transfer: Tokens carry legacy to next holders",
                "Collective Memory: Tokens commemorate shared experiences",
              ]}
              gradient="bg-blue-900/30"
              borderColor="border-blue-400"
            />

            <FeatureCard
              title="Cultural Safeguards"
              icon="🛡️"
              items={[
                "Anti-Speculation: Transfers disabled by default",
                "Rich Metadata: IPFS-backed story preservation",
                "Transfer Rules: Creator sets propagation rules",
                "Respect & Context: Story preserved immutably",
              ]}
              gradient="bg-purple-900/30"
              borderColor="border-purple-400"
            />

            <FeatureCard
              title="Social Graph Tracking"
              icon="🕸️"
              items={[
                "Propagation Path: Who received from whom",
                "Generation Tracking: Degrees from creator",
                "Network Visualization: Complete gratitude graph",
                "Metrics: Reach, depth, retention",
              ]}
              gradient="bg-green-900/30"
              borderColor="border-green-400"
            />

            <FeatureCard
              title="Community Building"
              icon="🤝"
              items={[
                "Shared Ownership: Multiple holders per token",
                "Network Effects: Value increases with spread",
                "Story-First Design: Narrative over gamification",
                "Intrinsic Motivation: No financial incentives",
              ]}
              gradient="bg-orange-900/30"
              borderColor="border-orange-400"
            />
          </div>
        </div>

        {/* Use Cases & Positioning */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-yellow-400/30">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-yellow-400 mr-3">💼</span>
            Use Cases & Target Audiences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="DAOs & Web3 Communities"
              icon="🏛️"
              items={["Recognize contributions", "Build reputation networks", "Track community impact"]}
              gradient="bg-gradient-to-br from-blue-800/30 to-purple-800/30"
              borderColor="border-blue-400/40"
            />

            <FeatureCard
              title="Education & Mentorship"
              icon="📚"
              items={["Recognize mentors", "Track mentorship chains", "Build learning networks"]}
              gradient="bg-gradient-to-br from-green-800/30 to-teal-800/30"
              borderColor="border-green-400/40"
            />

            <FeatureCard
              title="Open Source Projects"
              icon="💻"
              items={["Acknowledge contributors", "Track collaboration networks", "Build contributor reputation"]}
              gradient="bg-gradient-to-br from-purple-800/30 to-pink-800/30"
              borderColor="border-purple-400/40"
            />

            <FeatureCard
              title="Cultural Communities"
              icon="🌍"
              items={["Maintain gift economies", "Preserve cultural traditions", "Build reciprocal networks"]}
              gradient="bg-gradient-to-br from-orange-800/30 to-red-800/30"
              borderColor="border-orange-400/40"
            />

            <FeatureCard
              title="Non-Profit Organizations"
              icon="❤️"
              items={["Recognize volunteers", "Track impact networks", "Build community connections"]}
              gradient="bg-gradient-to-br from-indigo-800/30 to-blue-800/30"
              borderColor="border-indigo-400/40"
            />

            <FeatureCard
              title="Creative Collaborations"
              icon="🎨"
              items={["Acknowledge collaborators", "Track creative networks", "Build artistic communities"]}
              gradient="bg-gradient-to-br from-cyan-800/30 to-blue-800/30"
              borderColor="border-cyan-400/40"
            />
          </div>
        </div>

        {/* Scaffold-ETH 2 Integration Tips */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-lg rounded-2xl p-8 border border-cyan-400/30">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-cyan-400 mr-3">⚡</span>
            Scaffold-ETH 2 Integration Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Use Scaffold Hooks"
              icon="🪝"
              items={[
                "useScaffoldReadContract: getKudosMetadata, getPropagationNetwork",
                "useScaffoldWriteContract: createKudos, propagateKudos",
                "useScaffoldEventHistory: watch KudosPropagated events",
                "Display live gratitude network updates",
              ]}
              gradient="bg-blue-900/30"
              borderColor="border-blue-400"
            />

            <FeatureCard
              title="Visualize Networks"
              icon="📊"
              items={[
                "Use getPropagationNetwork to build graph",
                "Show generations with colors",
                "Display gratitude flow animation",
                "Build interactive network explorer",
              ]}
              gradient="bg-green-900/30"
              borderColor="border-green-400"
            />

            <FeatureCard
              title="Story Display"
              icon="📖"
              items={[
                "Show KudosMetadata.story prominently",
                "Display visualSymbol (wampum-inspired)",
                "Render mediaUri artwork/images",
                "Create beautiful gratitude cards",
                "Preserve narrative context",
              ]}
              gradient="bg-purple-900/30"
              borderColor="border-purple-400"
            />

            <FeatureCard
              title="Social Features"
              icon="👥"
              items={[
                'Show "Received from" relationships',
                "Display generation/distance from creator",
                "Build gratitude feed from events",
                'Create "My Gratitude Network" page',
              ]}
              gradient="bg-orange-900/30"
              borderColor="border-orange-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KudosDiagram;
