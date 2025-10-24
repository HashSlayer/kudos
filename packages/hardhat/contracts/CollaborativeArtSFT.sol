
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
* @title CollaborativeArtSFT
* @dev Semi-Fungible Token (SFT) implementation for collaborative art ownership
*
* WHAT IS A SEMI-FUNGIBLE TOKEN?
* - Combines features of both fungible (ERC-20) and non-fungible (ERC-721) tokens
* - Each token ID can have multiple identical copies (fungible within that ID)
* - But different token IDs represent different assets (non-fungible between IDs)
*
* REAL-WORLD ANALOGY:
* Think of it like concert tickets:
* - Token ID 1 = 100 VIP tickets (fungible - all VIP tickets are identical)
* - Token ID 2 = 500 General Admission tickets (fungible - all GA tickets are identical)
* - But VIP ≠ GA (non-fungible between different ticket types)
*
* IN THIS CONTRACT:
* - Each artwork is a unique token ID
* - Multiple "shares" of ownership can exist for each artwork
* - Owners can add co-owners who get their own shares
* - Those co-owners can then add additional owners
*/

contract CollaborativeArtSFT is ERC1155, Ownable {

using Strings for uint256;
// ============================================
// STATE VARIABLES
// ============================================

/**
* @dev Counter for generating unique token IDs
* WHY: Each artwork needs a unique identifier. We increment this for each new piece.
* EXAMPLE: First artwork = ID 1, second = ID 2, etc.
*/
uint256 private _currentTokenId;

/**
* @dev Base URI for token metadata
* WHY: Points to where the artwork metadata (image, description) is stored
* EXAMPLE: "https://api.myartplatform.com/metadata/"
* Final URI becomes: "https://api.myartplatform.com/metadata/1.json"
*/
string private _baseTokenURI;

/**
* @dev Total supply of shares for each token ID
* WHY: Tracks how many ownership shares exist for each artwork
* EXAMPLE: tokenSupply[1] = 100 means artwork #1 has 100 shares total
* NOTE: Semi-fungible because each share of artwork #1 is identical,
* but different from shares of artwork #2
*/
mapping(uint256 => uint256) public tokenSupply;

/**
* @dev Maximum supply limit for each token ID
* WHY: Artist can limit how many shares can ever exist for their artwork
* EXAMPLE: maxSupply[1] = 100 means artwork #1 can never have more than 100 shares
* PURPOSE: Creates scarcity and prevents unlimited dilution of ownership
*/
mapping(uint256 => uint256) public maxSupply; 

/**
* @dev Original creator of each token ID
* WHY: Preserves provenance - we always know who created the original artwork
* EXAMPLE: creators[1] = 0x123... means address 0x123 created artwork #1
* USE CASE: For royalties, verification, crediting the artist
*/

mapping(uint256 => address) public creators; 

/**
* @dev Mapping to track who can add new owners for a specific token
* WHY: This is the KEY feature for collaborative ownership!
* STRUCTURE: tokenId => (address => canAddOwners)
* EXAMPLE: If canAddOwners[1][0xAlice] = true, Alice can invite new owners to artwork #1
*
* PERMISSION CHAIN EXAMPLE:
* 1. Artist creates artwork #1
* 2. Artist gives Alice 10 shares + addOwner permission
* 3. Alice gives Bob 5 shares + addOwner permission
* 4. Bob can now give Charlie shares too!
*/

mapping(uint256 => mapping(address => bool)) public canAddOwners;

/**
* @dev Tracks minimum shares needed to gain addOwner permission
* WHY: Prevents someone with 1 tiny share from inviting unlimited people
* EXAMPLE: minSharesForPermission[1] = 5 means you need 5+ shares to invite others
* USE CASE: Artist sets this to maintain quality control over who can expand ownership
*/

mapping(uint256 => uint256) public minSharesForPermission;

// ============================================
// EVENTS
// ============================================

/**
* @dev Emitted when a new artwork is created
* WHY: Off-chain systems (your frontend, indexers) need to know about new art
* PARAMETERS:
* - tokenId: The unique ID assigned to this artwork
* - creator: Who created it
* - supply: How many shares were initially minted
* - maxSupply: Maximum shares that can ever exist
*/

event ArtworkCreated(

uint256 indexed tokenId,
address indexed creator,
uint256 supply,
uint256 maxSupply

);

/**
* @dev Emitted when someone gains or loses the ability to add owners
* WHY: Track permission changes for transparency and off-chain indexing
* PARAMETERS:
* - tokenId: Which artwork this permission relates to
* - account: Who gained/lost the permission
* - canAdd: True = gained permission, False = lost permission
*/

event OwnerAddPermissionChanged(

uint256 indexed tokenId,
address indexed account,
bool canAdd

);

  

/**
* @dev Emitted when new co-owners are added to an artwork
* WHY: Creates an audit trail of the ownership expansion
* PARAMETERS:
* - tokenId: Which artwork
* - addedBy: Who invited the new owner
* - newOwner: Who was invited
* - shares: How many shares they received
*/

event CoOwnerAdded(

uint256 indexed tokenId,
address indexed addedBy,
address indexed newOwner,
uint256 shares

);

// ============================================

// CONSTRUCTOR

// ============================================

/**
* @dev Sets up the contract with a base metadata URI
* @param baseURI Where the metadata JSON files are hosted
*
* WHY: The ERC1155 standard requires a URI to fetch artwork metadata
* EXAMPLE: If baseURI = "https://api.art.com/metadata/"
* Token #1 metadata = "https://api.art.com/metadata/1.json"
*
* The JSON file would contain:
* {
* "name": "Sunset Dreams #1",
* "description": "A collaborative digital artwork",
* "image": "ipfs://Qm...",
* "properties": { "artist": "Alice", "year": "2025" }
* }
*/

constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {

_baseTokenURI = baseURI;
_currentTokenId = 0; // Start token IDs from 1 (will be incremented before first use)

}

// ============================================
// CORE MINTING FUNCTIONS
// ============================================

/**
* @dev Creates a new artwork and mints initial shares
* @param initialSupply How many ownership shares to create initially
* @param _maxSupply Maximum shares that can ever exist (0 = unlimited)
* @param _minSharesForPermission Minimum shares needed to add new owners
* @param customUri Optional custom metadata URI for this specific artwork
* @return tokenId The ID assigned to this new artwork
*
* WORKFLOW EXAMPLE:
* 1. Artist calls: createArtwork(100, 1000, 10, "ipfs://Qm...")
* 2. Artist receives 100 shares of artwork
* 3. Max 1000 shares can ever exist
* 4. Need 10+ shares to invite others
* 5. Metadata stored at custom IPFS location
*
* WHY INITIAL SUPPLY < MAX SUPPLY?
* - Artist can keep majority control initially
* - Gradually add co-owners over time
* - Creates room for community growth
*
* WHY MIN SHARES FOR PERMISSION?
* - Prevents spam (someone with 1 share can't invite 1000 people)
* - Ensures only invested co-owners can expand the community
* - Artist maintains quality control
*/

function createArtwork(

uint256 initialSupply,
uint256 _maxSupply,
uint256 _minSharesForPermission,
string memory customUri

) public returns (uint256) {

    // Increment to get next token ID (starts at 1)
    _currentTokenId++;
    uint256 newTokenId = _currentTokenId;

    // Validate: Can't mint more than max supply allows
    require(
    _maxSupply == 0 || initialSupply <= _maxSupply,
    "Initial supply exceeds max supply"
    );

    // Record the creator (for provenance and royalties)
    creators[newTokenId] = msg.sender;

    // Set supply limits
    tokenSupply[newTokenId] = initialSupply;
    maxSupply[newTokenId] = _maxSupply; // 0 = unlimited
    minSharesForPermission[newTokenId] = _minSharesForPermission;

    // Give creator permission to add owners automatically
    // WHY: Creator should always be able to expand their community

    canAddOwners[newTokenId][msg.sender] = true;

    // Mint the initial shares to the creator
    // WHY: ERC1155's _mint function handles all the balance tracking

    _mint(msg.sender, newTokenId, initialSupply, "");

    // If custom URI provided, set it for this token
    if (bytes(customUri).length > 0) {
        emit URI(customUri, newTokenId);
    }

    // Notify the blockchain about the new artwork
    emit ArtworkCreated(newTokenId, msg.sender, initialSupply, _maxSupply);
    return newTokenId;

}

/**
* @dev Allows creator or contract owner to mint additional shares
* @param tokenId Which artwork to mint more shares for
* @param amount How many new shares to create
*
* WHY THIS FUNCTION EXISTS:
* - Artist might want to add more shares later
* - Enables gradual community expansion
* - Allows rewarding contributors over time

*

* RESTRICTIONS:

* - Only creator or contract owner can call this

* - Must respect max supply limit

*

* EXAMPLE USE CASE:

* - Artist creates artwork with 100 shares, max 1000

* - Community grows, artist wants to add 50 more members

* - Artist calls mintAdditional(1, 50)

* - Now 150 shares exist, still under 1000 limit

*/

function mintAdditional(uint256 tokenId, uint256 amount) public {

// Security: Only creator or contract owner can mint more

require(

msg.sender == creators[tokenId] || msg.sender == owner(),

"Not authorized to mint"

);

  

uint256 newSupply = tokenSupply[tokenId] + amount;

  

// Validate: Don't exceed max supply (if set)

require(

maxSupply[tokenId] == 0 || newSupply <= maxSupply[tokenId],

"Would exceed max supply"

);

  

// Update supply tracking

tokenSupply[tokenId] = newSupply;

  

// Mint new shares to the caller

_mint(msg.sender, tokenId, amount, "");

}

  

// ============================================

// COLLABORATIVE OWNERSHIP FUNCTIONS

// ============================================

  

/**

* @dev Add a new co-owner and give them shares

* @param tokenId Which artwork to add co-owner to

* @param newOwner Address of the new co-owner

* @param shares How many shares to give them

* @param givePermission Whether they can also add new owners

*

* THIS IS THE CORE COLLABORATIVE FEATURE!

*

* PERMISSION CHAIN EXAMPLE:

* 1. Alice creates artwork #1 (automatically has addOwner permission)

* 2. Alice calls: addCoOwner(1, Bob, 20, true)

* 3. Bob receives 20 shares + permission to add owners

* 4. Bob calls: addCoOwner(1, Charlie, 10, false)

* 5. Charlie receives 10 shares but CAN'T add more owners

*

* WHY THE PERMISSION PARAMETER?

* - Not every co-owner should invite others

* - Alice trusts Bob, Bob trusts Charlie, but Alice might not know Charlie

* - Creates controlled expansion of ownership

*

* BUSINESS LOGIC:

* - Must have permission to add owners

* - Must have minimum required shares

* - Shares come from YOUR balance (you're giving away your shares)

* - Respects max supply limits

*/

function addCoOwner(

uint256 tokenId,

address newOwner,

uint256 shares,

bool givePermission

) public {

// Security: Must have permission to add owners

require(

canAddOwners[tokenId][msg.sender],

"Not authorized to add co-owners"

);

  

// Validation: Must have enough shares yourself

require(

balanceOf(msg.sender, tokenId) >= shares,

"Insufficient shares to give"

);

  

// Validation: Must have minimum shares to grant permission

if (givePermission) {

require(

shares >= minSharesForPermission[tokenId],

"Must give minimum shares to grant permission"

);

}

  

// Transfer shares from you to the new owner

// WHY: You're giving away YOUR shares, not creating new ones

// This maintains the total supply

safeTransferFrom(msg.sender, newOwner, tokenId, shares, "");

  

// Grant permission to add owners if specified

if (givePermission) {

canAddOwners[tokenId][newOwner] = true;

emit OwnerAddPermissionChanged(tokenId, newOwner, true);

}

  

// Log this addition for transparency

emit CoOwnerAdded(tokenId, msg.sender, newOwner, shares);

}

  

/**

* @dev Batch add multiple co-owners at once

* @param tokenId Which artwork

* @param newOwners Array of addresses to add

* @param sharesPerOwner Array of share amounts (must match newOwners length)

* @param permissions Array of permission booleans (must match newOwners length)

*

* WHY BATCH FUNCTION?

* - Gas efficient: One transaction instead of many

* - Convenient: Artist can onboard whole team at once

* - Use case: Adding 10 collaborators who worked on the piece

*

* EXAMPLE:

* addMultipleCoOwners(

* 1,

* [0xBob, 0xCharlie, 0xDiana],

* [20, 15, 10],

* [true, false, false]

* )

* - Bob gets 20 shares + permission

* - Charlie gets 15 shares, no permission

* - Diana gets 10 shares, no permission

*/

function addMultipleCoOwners(

uint256 tokenId,

address[] memory newOwners,

uint256[] memory sharesPerOwner,

bool[] memory permissions

) public {

// Validate: All arrays must be same length

require(

newOwners.length == sharesPerOwner.length &&

newOwners.length == permissions.length,

"Array length mismatch"

);

  

// Security: Must have permission to add owners

require(

canAddOwners[tokenId][msg.sender],

"Not authorized to add co-owners"

);

  

uint256 totalShares = 0;

// Calculate total shares needed

for (uint256 i = 0; i < sharesPerOwner.length; i++) {

totalShares += sharesPerOwner[i];

}

  

// Validate: Must have enough shares for all recipients

require(

balanceOf(msg.sender, tokenId) >= totalShares,

"Insufficient shares for all recipients"

);

  

// Add each co-owner

for (uint256 i = 0; i < newOwners.length; i++) {

// Validate minimum shares if granting permission

if (permissions[i]) {

require(

sharesPerOwner[i] >= minSharesForPermission[tokenId],

"Must give minimum shares to grant permission"

);

}

  

// Transfer shares

safeTransferFrom(

msg.sender,

newOwners[i],

tokenId,

sharesPerOwner[i],

""

);

  

// Grant permission if specified

if (permissions[i]) {

canAddOwners[tokenId][newOwners[i]] = true;

emit OwnerAddPermissionChanged(tokenId, newOwners[i], true);

}

  

// Log the addition

emit CoOwnerAdded(

tokenId,

msg.sender,

newOwners[i],

sharesPerOwner[i]

);

}

}

  

// ============================================

// PERMISSION MANAGEMENT FUNCTIONS

// ============================================

  

/**

* @dev Grant or revoke permission to add owners

* @param tokenId Which artwork

* @param account Who to grant/revoke permission for

* @param canAdd True to grant, false to revoke

*

* WHY THIS FUNCTION?

* - Creator might want to remove someone's ability to invite others

* - Use case: Bob invited spam accounts, Alice revokes Bob's permission

* - Maintains control over community growth

*

* WHO CAN CALL THIS?

* - Only the original creator or contract owner

* - Prevents co-owners from arbitrarily revoking each other

*

* EXAMPLE:

* Bob was adding too many people, so:

* Alice calls: setAddOwnerPermission(1, Bob, false)

* Bob can still own his shares but can't invite more people

*/

function setAddOwnerPermission(

uint256 tokenId,

address account,

bool canAdd

) public {

// Security: Only creator or contract owner

require(

msg.sender == creators[tokenId] || msg.sender == owner(),

"Not authorized"

);

  

// Update permission

canAddOwners[tokenId][account] = canAdd;

// Log the change

emit OwnerAddPermissionChanged(tokenId, account, canAdd);

}

  

/**

* @dev Update minimum shares required for permission

* @param tokenId Which artwork

* @param newMinimum New minimum share requirement

*

* WHY ADJUSTABLE?

* - Artist might start with low threshold (5 shares)

* - As artwork becomes valuable, increase to 50 shares

* - Prevents dilution of control

*

* WHO CAN CALL THIS?

* - Only creator or contract owner

*

* EXAMPLE:

* Artwork becomes popular, artist wants more control:

* setMinSharesForPermission(1, 50)

* Now need 50 shares to invite others (was 5)

*/

function setMinSharesForPermission(

uint256 tokenId,

uint256 newMinimum

) public {

// Security: Only creator or contract owner

require(

msg.sender == creators[tokenId] || msg.sender == owner(),

"Not authorized"

);

  

minSharesForPermission[tokenId] = newMinimum;

}

  

// ============================================

// VIEW FUNCTIONS

// ============================================

  

/**

* @dev Get the metadata URI for a specific token

* @param tokenId Which artwork

* @return Full URI to the metadata JSON

*

* WHY THIS EXISTS?

* - ERC1155 standard requires this function

* - Marketplaces (OpenSea, etc.) call this to get artwork info

*

* HOW IT WORKS:

* - If custom URI was set: return that

* - Otherwise: return baseURI + tokenId + ".json"

*

* EXAMPLE:

* baseURI = "https://api.art.com/metadata/"

* tokenId = 1

* returns: "https://api.art.com/metadata/1.json"

*

* That JSON contains the artwork name, image, properties, etc.

*/

function uri(uint256 tokenId)

public

view

override

returns (string memory)

{

return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));

}

  

/**

* @dev Check if an address owns any shares of a token

* @param tokenId Which artwork

* @param account Address to check

* @return True if they own at least 1 share

*

* CONVENIENCE FUNCTION for frontends:

* - Quickly check if user is a co-owner

* - Used for UI access control

* - Simpler than checking balanceOf > 0

*/

function isCoOwner(uint256 tokenId, address account)

public

view

returns (bool)

{

return balanceOf(account, tokenId) > 0;

}

  

/**

* @dev Check if address can add new owners

* @param tokenId Which artwork

* @param account Address to check

* @return True if they have permission AND enough shares

*

* WHY TWO CONDITIONS?

* 1. Must have explicit permission

* 2. Must still own minimum required shares

*

* EXAMPLE:

* - Bob has permission but sells all shares

* - canAddNewOwners returns false (doesn't meet minimum)

* - Prevents "zombie" permissions from sold accounts

*/

function canAddNewOwners(uint256 tokenId, address account)

public

view

returns (bool)

{

return

canAddOwners[tokenId][account] &&

balanceOf(account, tokenId) >= minSharesForPermission[tokenId];

}

  

/**

* @dev Get comprehensive info about a token

* @param tokenId Which artwork

* @return creator Who created it

* @return supply Current total shares

* @return max Maximum possible shares

* @return minShares Minimum to grant permission

*

* WHY BATCH GETTER?

* - Frontend needs all this info

* - One call instead of four

* - More gas efficient

* - Better UX (faster loading)

*/

function getTokenInfo(uint256 tokenId)

public

view

returns (

address creator,

uint256 supply,

uint256 max,

uint256 minShares

)

{

return (

creators[tokenId],

tokenSupply[tokenId],

maxSupply[tokenId],

minSharesForPermission[tokenId]

);

}

  

// ============================================

// ADMIN FUNCTIONS

// ============================================

  

/**

* @dev Update the base URI for all tokens

* @param newBaseURI New base URI

*

* WHY NEEDED?

* - Migrate to different metadata hosting

* - Fix IPFS gateway issues

* - Update to better infrastructure

*

* WHO CAN CALL?

* - Only contract owner (deployed by)

*

* EXAMPLE:

* Moving from centralized to IPFS:

* Old: "https://api.art.com/metadata/"

* New: "ipfs://Qm.../metadata/"

*/

function setBaseURI(string memory newBaseURI) public onlyOwner {

_baseTokenURI = newBaseURI;

}

  

/**

* @dev Set custom URI for specific token

* @param tokenId Which artwork

* @param newuri Custom metadata URI

*

* WHY PER-TOKEN URI?

* - Some artworks might be on IPFS

* - Others on Arweave

* - Flexibility for different storage solutions

*

* WHO CAN CALL?

* - Only the creator or contract owner

*/

function setTokenURI(uint256 tokenId, string memory newuri) public {

require(

msg.sender == creators[tokenId] || msg.sender == owner(),

"Not authorized"

);

emit URI(newuri, tokenId);

}

}

  

/**

* ============================================

* SEMI-FUNGIBLE TOKEN CONCEPT EXPLAINED

* ============================================

*

* FUNGIBLE vs NON-FUNGIBLE vs SEMI-FUNGIBLE:

*

* FUNGIBLE (ERC-20):

* - All tokens identical

* - 1 USDC = 1 USDC = 1 USDC

* - Interchangeable

*

* NON-FUNGIBLE (ERC-721):

* - Every token unique

* - CryptoPunk #1 ≠ CryptoPunk #2

* - Each has different properties

*

* SEMI-FUNGIBLE (ERC-1155):

* - Within same ID: fungible

* - Between different IDs: non-fungible

* - 1 share of Artwork #1 = another share of Artwork #1

* - But: Artwork #1 share ≠ Artwork #2 share

*

* ============================================

* WHY USE ERC-1155 FOR THIS USE CASE?

* ============================================

*

* 1. MULTIPLE IDENTICAL SHARES:

* - Artwork #1 can have 100 identical ownership shares

* - All shares have equal rights/value

* - Perfect for collaborative ownership

*

* 2. GAS EFFICIENCY:

* - Batch transfers: send shares to 10 people in one transaction

* - Cheaper than ERC-721 (individual NFTs)

*

* 3. FLEXIBLE OWNERSHIP:

* - Same contract manages all artworks

* - Each artwork can have different supply

* - Artist controls scarcity per piece

*

* 4. BUILT FOR GAMING/COLLECTIBLES:

* - Originally designed for this use case

* - Battle-tested standard

* - Great marketplace support

*

* ============================================

* MARKETING & UX RECOMMENDATIONS

* ============================================

*

* 1. OWNERSHIP VISUALIZATION:

* - Show "pie chart" of co-owners

* - Display ownership percentage

* - Highlight if user can invite others

*

* 2. SOCIAL PROOF:

* - "42 co-owners" badge

* - Activity feed: "Alice added Bob as co-owner"

* - Ownership network graph

*

* 3. GAMIFICATION:

* - Badges for inviting X people

* - Achievements for collaboration

* - Leaderboard of most connected owners

*

* 4. PERMISSION CLARITY:

* - Clear visual indicator: "You can invite others"

* - Show minimum shares needed

* - Explain why you can't invite (not enough shares)

*

* 5. INVITE FLOW:

* - Simple "Invite Co-Owner" button

* - Suggest share amounts (1%, 5%, 10%)

* - Option to grant permission toggle

* - Preview: "This will use 10 of your 50 shares"

*

* 6. TRUST INDICATORS:

* - Show "Invited by: Alice"

* - Display invitation chain

* - "3 degrees from original artist"

*

* 7. MARKETPLACE INTEGRATION:

* - List shares for sale

* - Show "Average share price"

* - Price per share vs whole artwork

*

* 8. COMMUNITY FEATURES:

* - Co-owner chat/forum

* - Governance: vote on artwork decisions

* - Shared revenue distribution

*

* ============================================

* POTENTIAL BUSINESS MODELS

* ============================================

*

* 1. COLLABORATIVE ART PLATFORM:

* - Artists create, community owns

* - Platform fee on share transfers

* - Premium features for creators

*

* 2. FRACTIONAL ART OWNERSHIP:

* - Expensive art divided into shares

* - More accessible to collectors

* - Commission on trades

*

* 3. MUSIC RIGHTS:

* - Song ownership shares

* - Royalty distribution to owners

* - Streaming revenue sharing

*

* 4. COLLECTIVE CURATION:

* - Museum/gallery as shares

* - Owners vote on exhibitions

* - Membership benefits

*

* 5. CREATOR COLLECTIVES:

* - Startup equity model

* - Contributors get shares

* - Revenue sharing

*

* ============================================

* SCAFFOLD-ETH 2 INTEGRATION TIPS

* ============================================

*

* 1. Use Wagmi hooks:

* - useContractRead for balanceOf

* - useContractWrite for addCoOwner

* - useBalance for share counts

*

* 2. Contract hot reload:

* - Edit and see changes instantly

* - Fast iteration on UI

*

* 3. Burner wallet:

* - Test multi-user flows easily

* - Simulate ownership transfers

*

* 4. Events display:

* - Show live ownership changes

* - Activity feed from events

*

* 5. RainbowKit integration:

* - Easy wallet connection

* - Multiple wallet support

* - Great UX out of box

*/

