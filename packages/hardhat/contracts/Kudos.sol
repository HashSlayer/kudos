// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Kudos - A Distributed Gratitude Protocol
 * @author Inspired by Indigenous Wampum Systems
 * @notice This contract enables gratitude to propagate through social networks
 * @dev ERC-1155 based semi-fungible token system with propagation mechanics
 *
 * Core Philosophy:
 * - Gratitude should spread, not be hoarded
 * - Original creators maintain their tokens while sharing with others
 * - Each token represents a unique story of appreciation
 * - Distribution creates networks of shared acknowledgment
 */
contract Kudos is ERC1155, Ownable, ReentrancyGuard {
    // ============ State Variables ============

    uint256 private _tokenIdCounter;

    struct KudosMetadata {
        string story; // The narrative behind the gratitude
        address creator; // Original minter
        uint256 maxSupply; // Supply cap for this token
        uint256 currentSupply; // Current circulating supply
        uint256 createdAt; // Timestamp of creation
        bool transferable; // Can be traditionally transferred (vs propagation only)
        bool canPropagate; // Can holders distribute to others
        string visualSymbol; // Cultural/visual identifier (color, pattern)
    }

    struct PropagationRecord {
        address from; // Who distributed this token
        address to; // Who received it
        uint256 timestamp; // When it was distributed
        uint256 generation; // How many hops from origin (0 = creator)
    }

    // Token ID => Metadata
    mapping(uint256 => KudosMetadata) public kudosData;

    // Token ID => Array of propagation events
    mapping(uint256 => PropagationRecord[]) public propagationHistory;

    // Token ID => Address => Generation (how many hops from creator)
    mapping(uint256 => mapping(address => uint256)) public holderGeneration;

    // Token ID => Address => Timestamp of first receipt
    mapping(uint256 => mapping(address => uint256)) public firstReceiptTime;

    // Address => Array of token IDs they created
    mapping(address => uint256[]) public creatorTokens;

    // Address => Array of token IDs they hold
    mapping(address => uint256[]) public holderTokens;

    // ============ Events ============

    event KudosCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string story,
        uint256 maxSupply,
        uint256 timestamp
    );

    event KudosPropagated(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 generation,
        uint256 timestamp
    );

    event KudosTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    event PropagationSettingsUpdated(uint256 indexed tokenId, bool canPropagate, bool transferable);

    // ============ Errors ============

    error MaxSupplyReached();
    error NotTokenHolder();
    error InsufficientBalance();
    error PropagationDisabled();
    error TransferDisabled();
    error InvalidMaxSupply();
    error EmptyStory();
    error SelfPropagation();

    // ============ Constructor ============

    constructor() ERC1155("") Ownable(msg.sender) {
        // URI will be set per token via kudosData
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new Kudos token to express gratitude
     * @param story The narrative behind this gratitude
     * @param maxSupply Maximum number of copies that can exist
     * @param initialRecipients First recipients of this gratitude
     * @param visualSymbol Cultural/visual identifier for the token
     * @param _canPropagate Whether holders can distribute to others
     * @param _transferable Whether traditional transfers are allowed
     * @return tokenId The newly created token ID
     */
    function createKudos(
        string memory story,
        uint256 maxSupply,
        address[] memory initialRecipients,
        string memory visualSymbol,
        bool _canPropagate,
        bool _transferable
    ) external nonReentrant returns (uint256) {
        if (bytes(story).length == 0) revert EmptyStory();
        if (maxSupply == 0) revert InvalidMaxSupply();
        if (initialRecipients.length > maxSupply) revert MaxSupplyReached();

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Store metadata
        kudosData[tokenId] = KudosMetadata({
            story: story,
            creator: msg.sender,
            maxSupply: maxSupply,
            currentSupply: 0,
            createdAt: block.timestamp,
            transferable: _transferable,
            canPropagate: _canPropagate,
            visualSymbol: visualSymbol
        });

        // Creator always keeps the first copy (propagation model)
        _mint(msg.sender, tokenId, 1, "");
        kudosData[tokenId].currentSupply = 1;

        // Record creator's generation as 0
        holderGeneration[tokenId][msg.sender] = 0;
        firstReceiptTime[tokenId][msg.sender] = block.timestamp;

        // Track creator's tokens
        creatorTokens[msg.sender].push(tokenId);
        holderTokens[msg.sender].push(tokenId);

        // Distribute to initial recipients (generation 1)
        for (uint256 i = 0; i < initialRecipients.length; i++) {
            _propagateInternal(tokenId, msg.sender, initialRecipients[i], 1);
        }

        emit KudosCreated(tokenId, msg.sender, story, maxSupply, block.timestamp);

        return tokenId;
    }

    /**
     * @notice Propagate kudos to new recipient(s) - creator and all holders maintain their tokens
     * @dev This is the PRIMARY distribution method - gratitude spreads without loss
     * @param tokenId The token to propagate
     * @param recipients Array of addresses to receive the gratitude
     */
    function propagateKudos(uint256 tokenId, address[] memory recipients) external nonReentrant {
        KudosMetadata storage metadata = kudosData[tokenId];

        if (!metadata.canPropagate) revert PropagationDisabled();
        if (balanceOf(msg.sender, tokenId) == 0) revert NotTokenHolder();

        uint256 senderGeneration = holderGeneration[tokenId][msg.sender];
        uint256 newGeneration = senderGeneration + 1;

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];

            if (recipient == msg.sender) revert SelfPropagation();

            _propagateInternal(tokenId, msg.sender, recipient, newGeneration);
        }
    }

    /**
     * @notice Internal propagation logic with supply checking
     */
    function _propagateInternal(uint256 tokenId, address from, address to, uint256 generation) internal {
        KudosMetadata storage metadata = kudosData[tokenId];

        if (metadata.currentSupply >= metadata.maxSupply) revert MaxSupplyReached();

        // Mint new token to recipient (propagation model)
        _mint(to, tokenId, 1, "");
        metadata.currentSupply++;

        // Record propagation
        propagationHistory[tokenId].push(
            PropagationRecord({ from: from, to: to, timestamp: block.timestamp, generation: generation })
        );

        // Set recipient's generation if first time receiving
        if (holderGeneration[tokenId][to] == 0 || holderGeneration[tokenId][to] > generation) {
            holderGeneration[tokenId][to] = generation;
        }

        // Record first receipt time
        if (firstReceiptTime[tokenId][to] == 0) {
            firstReceiptTime[tokenId][to] = block.timestamp;
            holderTokens[to].push(tokenId);
        }

        emit KudosPropagated(tokenId, from, to, generation, block.timestamp);
    }

    /**
     * @notice Traditional transfer - holder LOSES their token (optional, disabled by default)
     * @dev Only enabled if transferable flag is true for this token
     * @param from Address to transfer from
     * @param to Address to transfer to
     * @param tokenId Token to transfer
     * @param amount Amount to transfer
     */
    function traditionalTransfer(address from, address to, uint256 tokenId, uint256 amount) external {
        if (!kudosData[tokenId].transferable) revert TransferDisabled();
        if (balanceOf(from, tokenId) < amount) revert InsufficientBalance();

        safeTransferFrom(from, to, tokenId, amount, "");

        emit KudosTransferred(tokenId, from, to, amount, block.timestamp);
    }

    // ============ Query Functions ============

    /**
     * @notice Get the complete propagation network for a token
     * @param tokenId The token to query
     * @return Array of all propagation events
     */
    function getPropagationNetwork(uint256 tokenId) external view returns (PropagationRecord[] memory) {
        return propagationHistory[tokenId];
    }

    /**
     * @notice Get how many "hops" a holder is from the original creator
     * @param tokenId The token to query
     * @param holder The address to check
     * @return The generation/hop count (0 = creator)
     */
    function getHolderGeneration(uint256 tokenId, address holder) external view returns (uint256) {
        return holderGeneration[tokenId][holder];
    }

    /**
     * @notice Get all tokens created by an address
     * @param creator The address to query
     * @return Array of token IDs
     */
    function getCreatorTokens(address creator) external view returns (uint256[] memory) {
        return creatorTokens[creator];
    }

    /**
     * @notice Get all tokens held by an address
     * @param holder The address to query
     * @return Array of token IDs
     */
    function getHolderTokens(address holder) external view returns (uint256[] memory) {
        return holderTokens[holder];
    }

    /**
     * @notice Get complete metadata for a token
     * @param tokenId The token to query
     * @return The metadata struct
     */
    function getKudosMetadata(uint256 tokenId) external view returns (KudosMetadata memory) {
        return kudosData[tokenId];
    }

    /**
     * @notice Calculate the "reach" of a kudos (total unique holders)
     * @param tokenId The token to query
     * @return Number of unique holders
     */
    function getKudosReach(uint256 tokenId) external view returns (uint256) {
        return kudosData[tokenId].currentSupply;
    }

    /**
     * @notice Get the maximum propagation depth (longest chain from creator)
     * @param tokenId The token to query
     * @return The maximum generation number
     */
    function getMaxPropagationDepth(uint256 tokenId) external view returns (uint256) {
        PropagationRecord[] memory history = propagationHistory[tokenId];
        uint256 maxGeneration = 0;

        for (uint256 i = 0; i < history.length; i++) {
            if (history[i].generation > maxGeneration) {
                maxGeneration = history[i].generation;
            }
        }

        return maxGeneration;
    }

    // ============ Admin Functions ============

    /**
     * @notice Update propagation settings for a token (creator only)
     * @param tokenId The token to update
     * @param _canPropagate New propagation setting
     * @param _transferable New transferable setting
     */
    function updatePropagationSettings(uint256 tokenId, bool _canPropagate, bool _transferable) external {
        if (kudosData[tokenId].creator != msg.sender) revert NotTokenHolder();

        kudosData[tokenId].canPropagate = _canPropagate;
        kudosData[tokenId].transferable = _transferable;

        emit PropagationSettingsUpdated(tokenId, _canPropagate, _transferable);
    }

    /**
     * @notice Update the base URI for token metadata
     * @param newuri The new base URI
     */
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    /**
     * @notice Get the current token ID counter
     * @return The next token ID to be minted
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ============ Override Functions ============

    /**
     * @notice Override URI function to return token-specific metadata
     * @dev In production, this would return IPFS hash or API endpoint
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        // In Scaffold-ETH 2, you'd typically return:
        // return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
        return super.uri(tokenId);
    }

    /**
     * @notice Block standard ERC-1155 transfers unless explicitly enabled
     * @dev This enforces the propagation model by default
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        // Allow if transferable is enabled OR if it's coming from _propagateInternal
        if (!kudosData[id].transferable && msg.sender != address(this)) {
            revert TransferDisabled();
        }
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @notice Block batch transfers unless explicitly enabled
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        for (uint256 i = 0; i < ids.length; i++) {
            if (!kudosData[ids[i]].transferable) {
                revert TransferDisabled();
            }
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
