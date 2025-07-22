# 🔌 **DECKLAB API INTEGRATION & BACKEND SERVICES**

## **🎯 API OVERVIEW**

DeckLab integrates with multiple external APIs and services to provide comprehensive trading card functionality:

### **Primary APIs**
- **Pokémon TCG API**: Card database and metadata
- **eBay API**: Market pricing and auction data
- **TCGPlayer API**: Secondary market pricing
- **Firebase Services**: Backend infrastructure (Project: decklab-6c374)
- **Google Cloud Vision API**: Advanced image analysis
- **Core ML**: On-device AI processing

---

## **🎴 POKÉMON TCG API INTEGRATION**

### **API Configuration**
```swift
// PokemonTCGService.swift
public struct PokemonTCGService: Sendable {
    private let apiKey: String
    private let baseURL = "https://api.pokemontcg.io/v2"
    
    public init(apiKey: String) {
        self.apiKey = apiKey
    }
}

// Dependency Configuration
private enum PokemonTCGServiceKey: DependencyKey {
    static let liveValue = PokemonTCGService(apiKey: "your-api-key-here")
}
```

### **Card Search & Retrieval**
```swift
// Card Search Implementation
extension PokemonTCGService {
    public func fetchSets() async throws -> [PokemonSet] {
        let url = URL(string: "\(baseURL)/sets")!
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "X-Api-Key")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(PokemonTCGSetsResponse.self, from: data)
        
        return response.data.map { setData in
            PokemonSet(
                id: setData.id,
                name: setData.name,
                series: setData.series,
                printedTotal: setData.printedTotal,
                total: setData.total,
                legalities: setData.legalities,
                ptcgoCode: setData.ptcgoCode,
                releaseDate: setData.releaseDate,
                updatedAt: setData.updatedAt,
                images: SetImages(
                    symbol: setData.images.symbol,
                    logo: setData.images.logo
                )
            )
        }
    }
    
    public func fetchCards(query: String? = nil, set: String? = nil, page: Int = 1, pageSize: Int = 250) async throws -> [PokemonCard] {
        var components = URLComponents(string: "\(baseURL)/cards")!
        var queryItems: [URLQueryItem] = []
        
        if let query = query {
            queryItems.append(URLQueryItem(name: "q", value: query))
        }
        
        if let set = set {
            queryItems.append(URLQueryItem(name: "set.id", value: set))
        }
        
        queryItems.append(URLQueryItem(name: "page", value: "\(page)"))
        queryItems.append(URLQueryItem(name: "pageSize", value: "\(pageSize)"))
        
        components.queryItems = queryItems
        
        var request = URLRequest(url: components.url!)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "X-Api-Key")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(PokemonTCGCardsResponse.self, from: data)
        
        return response.data.map { cardData in
            PokemonCard(
                id: cardData.id,
                name: cardData.name,
                supertype: cardData.supertype,
                subtypes: cardData.subtypes,
                level: cardData.level,
                hp: cardData.hp,
                types: cardData.types,
                evolvesFrom: cardData.evolvesFrom,
                evolvesTo: cardData.evolvesTo,
                rules: cardData.rules,
                attacks: cardData.attacks?.map { attack in
                    CardAttack(
                        name: attack.name,
                        cost: attack.cost,
                        convertedEnergyCost: attack.convertedEnergyCost,
                        damage: attack.damage,
                        text: attack.text
                    )
                },
                weaknesses: cardData.weaknesses?.map { weakness in
                    CardWeakness(
                        type: weakness.type,
                        value: weakness.value
                    )
                },
                resistances: cardData.resistances?.map { resistance in
                    CardResistance(
                        type: resistance.type,
                        value: resistance.value
                    )
                },
                retreatCost: cardData.retreatCost,
                convertedRetreatCost: cardData.convertedRetreatCost,
                set: PokemonSet(
                    id: cardData.set.id,
                    name: cardData.set.name,
                    series: cardData.set.series,
                    printedTotal: cardData.set.printedTotal,
                    total: cardData.set.total,
                    legalities: cardData.set.legalities,
                    ptcgoCode: cardData.set.ptcgoCode,
                    releaseDate: cardData.set.releaseDate,
                    updatedAt: cardData.set.updatedAt,
                    images: SetImages(
                        symbol: cardData.set.images.symbol,
                        logo: cardData.set.images.logo
                    )
                ),
                number: cardData.number,
                artist: cardData.artist,
                rarity: cardData.rarity,
                flavorText: cardData.flavorText,
                nationalPokedexNumbers: cardData.nationalPokedexNumbers,
                legalities: cardData.legalities,
                regulationMark: cardData.regulationMark,
                images: CardImages(
                    small: cardData.images.small,
                    large: cardData.images.large
                ),
                tcgplayer: cardData.tcgplayer,
                cardmarket: cardData.cardmarket
            )
        }
    }
}
```

### **Data Models**
```swift
// Pokemon TCG API Models
struct PokemonTCGSetsResponse: Codable {
    let data: [PokemonSetData]
}

struct PokemonTCGCardsResponse: Codable {
    let data: [PokemonCardData]
}

struct PokemonSetData: Codable {
    let id: String
    let name: String
    let series: String
    let printedTotal: Int
    let total: Int
    let legalities: [String: String]?
    let ptcgoCode: String?
    let releaseDate: String
    let updatedAt: String
    let images: SetImagesData
}

struct PokemonCardData: Codable {
    let id: String
    let name: String
    let supertype: String?
    let subtypes: [String]?
    let level: String?
    let hp: String?
    let types: [String]?
    let evolvesFrom: String?
    let evolvesTo: [String]?
    let rules: [String]?
    let attacks: [AttackData]?
    let weaknesses: [WeaknessData]?
    let resistances: [ResistanceData]?
    let retreatCost: [String]?
    let convertedRetreatCost: Int?
    let set: PokemonSetData
    let number: String
    let artist: String?
    let rarity: String?
    let flavorText: String?
    let nationalPokedexNumbers: [Int]?
    let legalities: [String: String]?
    let regulationMark: String?
    let images: CardImagesData
    let tcgplayer: TCGPlayerData?
    let cardmarket: CardMarketData?
}

struct SetImagesData: Codable {
    let symbol: String
    let logo: String
}

struct CardImagesData: Codable {
    let small: String
    let large: String
}

struct AttackData: Codable {
    let name: String
    let cost: [String]?
    let convertedEnergyCost: Int
    let damage: String?
    let text: String?
}

struct WeaknessData: Codable {
    let type: String
    let value: String
}

struct ResistanceData: Codable {
    let type: String
    let value: String
}

struct TCGPlayerData: Codable {
    let url: String
    let updatedAt: String
    let prices: [String: PriceData]?
}

struct CardMarketData: Codable {
    let url: String
    let updatedAt: String
    let prices: [String: PriceData]?
}

struct PriceData: Codable {
    let low: Double?
    let mid: Double?
    let high: Double?
    let market: Double?
    let directLow: Double?
}
```

---

## **📊 MARKET DATA API INTEGRATION**

### **eBay API Integration**
```swift
// eBayAPIService.swift
class eBayAPIService: ObservableObject {
    private let baseURL = "https://api.ebay.com"
    private let appID = "YOUR_EBAY_APP_ID"
    private let certID = "YOUR_EBAY_CERT_ID"
    private let clientSecret = "YOUR_EBAY_CLIENT_SECRET"
    
    // eBay Verification Token (from Firebase Functions)
    private let verificationToken = "decklabebayverify1234567890abcdef0987654321fedcba"
    
    private var accessToken: String?
    private var tokenExpiry: Date?
    
    private func getAccessToken() async throws -> String {
        if let token = accessToken, let expiry = tokenExpiry, expiry > Date() {
            return token
        }
        
        let url = URL(string: "\(baseURL)/identity/v1/oauth2/token")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let credentials = "\(appID):\(clientSecret)".data(using: .utf8)!.base64EncodedString()
        request.setValue("Basic \(credentials)", forHTTPHeaderField: "Authorization")
        
        let body = "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope"
        request.httpBody = body.data(using: .utf8)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let tokenResponse = try JSONDecoder().decode(EBayTokenResponse.self, from: data)
        accessToken = tokenResponse.accessToken
        tokenExpiry = Date().addingTimeInterval(tokenResponse.expiresIn)
        
        return tokenResponse.accessToken
    }
    
    func searchListings(query: String, limit: Int = 50) async throws -> [EBayListing] {
        let token = try await getAccessToken()
        let url = URL(string: "\(baseURL)/buy/browse/v1/item_summary/search")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: true)!
        
        components.queryItems = [
            URLQueryItem(name: "q", value: query),
            URLQueryItem(name: "limit", value: "\(limit)"),
            URLQueryItem(name: "filter", value: "conditions:{NEW|USED_EXCELLENT|USED_VERY_GOOD}")
        ]
        
        var request = URLRequest(url: components.url!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let searchResponse = try JSONDecoder().decode(EBaySearchResponse.self, from: data)
        return searchResponse.itemSummaries
    }
}

// eBay API Models
struct EBayTokenResponse: Codable {
    let accessToken: String
    let expiresIn: TimeInterval
    let tokenType: String
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case expiresIn = "expires_in"
        case tokenType = "token_type"
    }
}

struct EBaySearchResponse: Codable {
    let itemSummaries: [EBayListing]
    let total: Int
    let limit: Int
    let offset: Int
}

struct EBayListing: Codable, Identifiable {
    let itemId: String
    let title: String
    let price: EBayPrice
    let condition: String?
    let image: EBayImage?
    let itemWebUrl: String
    let seller: EBaySeller?
    
    var id: String { itemId }
}

struct EBayPrice: Codable {
    let value: String
    let currency: String
}

struct EBayImage: Codable {
    let imageUrl: String
}

struct EBaySeller: Codable {
    let username: String
    let feedbackPercentage: String?
    let feedbackScore: Int?
}
```

### **TCGPlayer API Integration**
```swift
// TCGPlayerAPIService.swift
class TCGPlayerAPIService: ObservableObject {
    private let baseURL = "https://api.tcgplayer.com"
    private let publicKey = "YOUR_TCGPLAYER_PUBLIC_KEY"
    private let privateKey = "YOUR_TCGPLAYER_PRIVATE_KEY"
    
    private var accessToken: String?
    private var tokenExpiry: Date?
    
    private func getAccessToken() async throws -> String {
        if let token = accessToken, let expiry = tokenExpiry, expiry > Date() {
            return token
        }
        
        let url = URL(string: "\(baseURL)/token")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let body = "grant_type=client_credentials&client_id=\(publicKey)&client_secret=\(privateKey)"
        request.httpBody = body.data(using: .utf8)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let tokenResponse = try JSONDecoder().decode(TCGPlayerTokenResponse.self, from: data)
        accessToken = tokenResponse.accessToken
        tokenExpiry = Date().addingTimeInterval(tokenResponse.expiresIn)
        
        return tokenResponse.accessToken
    }
    
    func getProductPrices(productId: Int) async throws -> [TCGPlayerPrice] {
        let token = try await getAccessToken()
        let url = URL(string: "\(baseURL)/pricing/product/\(productId)")!
        
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let pricesResponse = try JSONDecoder().decode(TCGPlayerPricesResponse.self, from: data)
        return pricesResponse.results
    }
}

// TCGPlayer API Models
struct TCGPlayerTokenResponse: Codable {
    let accessToken: String
    let expiresIn: TimeInterval
    let tokenType: String
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case expiresIn = "expires_in"
        case tokenType = "token_type"
    }
}

struct TCGPlayerPricesResponse: Codable {
    let results: [TCGPlayerPrice]
    let success: Bool
    let errors: [String]?
}

struct TCGPlayerPrice: Codable {
    let productId: Int
    let subTypeName: String
    let lowPrice: Double?
    let midPrice: Double?
    let highPrice: Double?
    let marketPrice: Double?
    let directLowPrice: Double?
    let updatedAt: String
}
```

---

## **🔥 FIREBASE BACKEND SERVICES**

### **Firebase Configuration**
```json
// .firebaserc
{
  "projects": {
    "default": "decklab-6c374"
  }
}

// firebase.json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run lint"
      ]
    }
  ]
}
```

### **Firebase Functions Configuration**
```json
// functions/package.json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "lint": "eslint .",
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "22"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^12.6.0",
    "firebase-functions": "^6.0.1"
  },
  "devDependencies": {
    "eslint": "^8.15.0",
    "eslint-config-google": "^0.14.0",
    "firebase-functions-test": "^3.1.0"
  },
  "private": true
}
```

### **Firebase Functions Implementation**
```javascript
// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const crypto = require("crypto");
const app = express();

const VERIFICATION_TOKEN = "decklabebayverify1234567890abcdef0987654321fedcba";
const ENDPOINT_URL = "https://us-central1-decklab-6c374.cloudfunctions.net/api/ebay/account-deletion-notification";

app.use(express.json());

app.get("/ebay/account-deletion-notification", (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (challengeCode) {
    // Compute SHA-256 hash: challengeCode + verificationToken + endpoint
    const hash = crypto.createHash("sha256");
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT_URL);
    const responseHash = hash.digest("hex");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({challengeResponse: responseHash});
  }
  res.status(400).send("Missing challenge_code");
});

app.post("/ebay/account-deletion-notification", (req, res) => {
  // For verification, echo back the token (not used by eBay, but safe to keep)
  if (req.body && req.body.verificationToken) {
    return res.status(200).send(req.body.verificationToken);
  }
  // Handle actual deletion notification here (log, delete user, etc.)
  res.status(200).send("OK");
});

exports.api = functions.https.onRequest(app);
```

### **Firebase Service Implementation**
```swift
// FirebaseService.swift
class FirebaseService: ObservableObject {
    static let shared = FirebaseService()
    
    private let db = Firestore.firestore()
    private let auth = Auth.auth()
    private let storage = Storage.storage()
    
    // Firebase Project Configuration
    private let projectID = "decklab-6c374"
    
    init() {
        configureFirebase()
    }
    
    private func configureFirebase() {
        // Firebase configuration is handled in GoogleService-Info.plist
        // Project ID: decklab-6c374
    }
    
    // User Management
    func createUser(email: String, password: String, username: String) async throws -> User {
        let result = try await auth.createUser(withEmail: email, password: password)
        
        let user = User(
            id: result.user.uid,
            email: email,
            username: username,
            createdAt: Date(),
            profileImageURL: nil
        )
        
        try await db.collection("users").document(user.id).setData(user.toDictionary())
        return user
    }
    
    // Collection Management
    func addCardToCollection(_ card: Card, userId: String) async throws {
        let cardData = card.toDictionary()
        try await db.collection("users").document(userId)
            .collection("collection").document(card.id).setData(cardData)
    }
    
    // Real-time Updates
    func observeCollectionChanges(userId: String) -> AnyPublisher<[Card], Error> {
        return db.collection("users").document(userId)
            .collection("collection")
            .addSnapshotListener { snapshot, error in
                if let error = error {
                    return Fail(error: error).eraseToAnyPublisher()
                }
                
                let cards = snapshot?.documents.compactMap { doc in
                    Card.fromDictionary(doc.data())
                } ?? []
                
                return Just(cards).setFailureType(to: Error.self).eraseToAnyPublisher()
            }
    }
}
```

---

## **🔍 GOOGLE CLOUD VISION API**

### **Configuration**
```xml
<!-- DeckLab-Info.plist -->
<key>GoogleCloudVisionAPIKey</key>
<string>$(GOOGLE_CLOUD_VISION_API_KEY)</string>
```

### **Google Sign-In Configuration**
```xml
<!-- DeckLab-Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>GoogleSignIn</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.845603251861-0m42kucskj4kh8utbf18u3ckpfaad0aa</string>
        </array>
    </dict>
</array>
```

### **Vision API Service**
```swift
// GoogleVisionService.swift
class GoogleVisionService: ObservableObject {
    private let apiKey: String
    
    init() {
        // Load from Info.plist
        self.apiKey = Bundle.main.object(forInfoDictionaryKey: "GoogleCloudVisionAPIKey") as? String ?? ""
    }
    
    func analyzeCardImage(_ image: UIImage) async throws -> VisionAnalysis {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw VisionError.invalidImageData
        }
        
        let base64Image = imageData.base64EncodedString()
        
        let url = URL(string: "https://vision.googleapis.com/v1/images:annotate?key=\(apiKey)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody = [
            "requests": [
                [
                    "image": [
                        "content": base64Image
                    ],
                    "features": [
                        [
                            "type": "TEXT_DETECTION",
                            "maxResults": 10
                        ],
                        [
                            "type": "LABEL_DETECTION",
                            "maxResults": 10
                        ]
                    ]
                ]
            ]
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw VisionError.apiError
        }
        
        let visionResponse = try JSONDecoder().decode(VisionResponse.self, from: data)
        return VisionAnalysis(from: visionResponse)
    }
}

// Vision API Models
struct VisionResponse: Codable {
    let responses: [VisionResponseData]
}

struct VisionResponseData: Codable {
    let textAnnotations: [TextAnnotation]?
    let labelAnnotations: [LabelAnnotation]?
}

struct TextAnnotation: Codable {
    let description: String
    let boundingPoly: BoundingPoly
}

struct LabelAnnotation: Codable {
    let description: String
    let score: Double
}

struct BoundingPoly: Codable {
    let vertices: [Vertex]
}

struct Vertex: Codable {
    let x: Int
    let y: Int
}

struct VisionAnalysis {
    let detectedText: [String]
    let labels: [String]
    
    init(from response: VisionResponse) {
        self.detectedText = response.responses.first?.textAnnotations?.map { $0.description } ?? []
        self.labels = response.responses.first?.labelAnnotations?.map { $0.description } ?? []
    }
}

enum VisionError: Error {
    case invalidImageData
    case apiError
}
```

---

## **📊 DATA MODELS & TRANSFORMATIONS**

### **Core Data Models**
```swift
// AppModels.swift
struct User: Codable, Identifiable, Equatable {
    let id: String
    let email: String
    let username: String
    let createdAt: Date
    let profileImageURL: String?
    var level: Int = 1
    var experience: Int = 0
    var achievements: [String] = []
    
    func toDictionary() -> [String: Any] {
        [
            "id": id,
            "email": email,
            "username": username,
            "createdAt": createdAt.timeIntervalSince1970,
            "profileImageURL": profileImageURL ?? "",
            "level": level,
            "experience": experience,
            "achievements": achievements
        ]
    }
    
    static func fromDictionary(_ dict: [String: Any]) -> User {
        User(
            id: dict["id"] as? String ?? "",
            email: dict["email"] as? String ?? "",
            username: dict["username"] as? String ?? "",
            createdAt: Date(timeIntervalSince1970: dict["createdAt"] as? TimeInterval ?? 0),
            profileImageURL: dict["profileImageURL"] as? String,
            level: dict["level"] as? Int ?? 1,
            experience: dict["experience"] as? Int ?? 0,
            achievements: dict["achievements"] as? [String] ?? []
        )
    }
}

struct MarketData: Codable, Equatable {
    let cardId: String
    let lastUpdated: Date
    let prices: [String: Double]
    let marketTrend: MarketTrend
    let volume: Int
    
    func toDictionary() -> [String: Any] {
        [
            "cardId": cardId,
            "lastUpdated": lastUpdated.timeIntervalSince1970,
            "prices": prices,
            "marketTrend": marketTrend.rawValue,
            "volume": volume
        ]
    }
    
    static func fromDictionary(_ dict: [String: Any]) -> MarketData {
        MarketData(
            cardId: dict["cardId"] as? String ?? "",
            lastUpdated: Date(timeIntervalSince1970: dict["lastUpdated"] as? TimeInterval ?? 0),
            prices: dict["prices"] as? [String: Double] ?? [:],
            marketTrend: MarketTrend(rawValue: dict["marketTrend"] as? String ?? "stable") ?? .stable,
            volume: dict["volume"] as? Int ?? 0
        )
    }
}

enum MarketTrend: String, Codable, CaseIterable {
    case rising = "rising"
    case falling = "falling"
    case stable = "stable"
    case volatile = "volatile"
}
```

---

## **🔒 SECURITY & ERROR HANDLING**

### **API Error Handling**
```swift
// APIError.swift
enum APIError: Error, LocalizedError {
    case invalidResponse
    case networkError(Error)
    case decodingError(Error)
    case rateLimitExceeded
    case unauthorized
    case serverError(Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from server"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .decodingError(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .rateLimitExceeded:
            return "Rate limit exceeded. Please try again later."
        case .unauthorized:
            return "Unauthorized access. Please sign in again."
        case .serverError(let code):
            return "Server error (\(code)). Please try again later."
        }
    }
}

enum FirestoreError: Error, LocalizedError {
    case documentNotFound
    case permissionDenied
    case invalidData
    
    var errorDescription: String? {
        switch self {
        case .documentNotFound:
            return "Document not found"
        case .permissionDenied:
            return "Permission denied"
        case .invalidData:
            return "Invalid data format"
        }
    }
}

enum StorageError: Error, LocalizedError {
    case invalidImageData
    case uploadFailed
    case downloadFailed
    
    var errorDescription: String? {
        switch self {
        case .invalidImageData:
            return "Invalid image data"
        case .uploadFailed:
            return "Failed to upload file"
        case .downloadFailed:
            return "Failed to download file"
        }
    }
}
```

---

## **🔧 ENVIRONMENT SETUP**

### **Required Environment Variables**
```bash
# API Keys (set in Xcode build settings or environment)
GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_vision_api_key
POKEMON_TCG_API_KEY=your_pokemon_tcg_api_key
EBAY_APP_ID=your_ebay_app_id
EBAY_CERT_ID=your_ebay_cert_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
TCGPLAYER_PUBLIC_KEY=your_tcgplayer_public_key
TCGPLAYER_PRIVATE_KEY=your_tcgplayer_private_key

# Firebase Configuration
FIREBASE_PROJECT_ID=decklab-6c374
GOOGLE_SIGN_IN_CLIENT_ID=com.googleusercontent.apps.845603251861-0m42kucskj4kh8utbf18u3ckpfaad0aa

# eBay Verification
EBAY_VERIFICATION_TOKEN=decklabebayverify1234567890abcdef0987654321fedcba
```

### **Xcode Build Settings**
```swift
// Add to your Xcode project build settings
// User-Defined Settings:
// GOOGLE_CLOUD_VISION_API_KEY = $(GOOGLE_CLOUD_VISION_API_KEY)
// POKEMON_TCG_API_KEY = your_actual_api_key
// EBAY_APP_ID = your_actual_ebay_app_id
// EBAY_CERT_ID = your_actual_ebay_cert_id
// EBAY_CLIENT_SECRET = your_actual_ebay_client_secret
// TCGPLAYER_PUBLIC_KEY = your_actual_tcgplayer_public_key
// TCGPLAYER_PRIVATE_KEY = your_actual_tcgplayer_private_key
```

---

**Last Updated:** January 2025  
**Version:** 2.0  
**Status:** ✅ **API INTEGRATION READY** 