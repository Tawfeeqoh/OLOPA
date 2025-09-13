// --- SPA navigation ---
function show(id){
  const sections = document.querySelectorAll('main section');
  sections.forEach(s => s.id === id ? s.classList.remove('hidden') : s.classList.add('hidden'));
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.nav').forEach(btn => btn.addEventListener('click', ()=> show(btn.dataset.target)));
document.querySelectorAll('[data-target]').forEach(btn => btn.addEventListener('click', ()=> show(btn.dataset.target)));
show('home');

// --- Solana provider & connection ---
let provider = null;
let connection = null;
async function detectProvider(){
  if(!window.solanaWeb3) {
    console.warn('Solana Web3 not available, using demo mode');
    return null;
  }
  if(window.solana && window.solana.isPhantom){
    provider = window.solana;
    const { clusterApiUrl, Connection } = window.solanaWeb3;
    connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    console.log('Phantom provider detected');
    return provider;
  }
  return null;
}
// Only detect provider if solanaWeb3 is available
if(window.solanaWeb3) {
  detectProvider();
}

// --- Wallet state ---
let wallet = JSON.parse(localStorage.getItem('olopa_wallet')||'null');
if(!wallet){ wallet = { addr: null, bal: 0, feesCollected: 0, activity: [], isPhantom: false }; localStorage.setItem('olopa_wallet', JSON.stringify(wallet)); }

async function updateWalletUI(){
  wallet = JSON.parse(localStorage.getItem('olopa_wallet'));
  
  // Query elements on-demand with null guards to avoid timing issues
  const walletDisplay = document.getElementById('walletDisplay');
  const demoBalance = document.getElementById('demoBalance');
  const mobileWalletDisplay = document.getElementById('mobileWalletDisplay');
  const mobileDemoBalance = document.getElementById('mobileDemoBalance');
  const dashWallet = document.getElementById('dashWallet');
  const dashBal = document.getElementById('dashBal');
  const dashEarnings = document.getElementById('dashEarnings');
  const dashActivity = document.getElementById('dashActivity');
  const dashReputation = document.getElementById('dashReputation');
  
  const displayAddr = wallet.addr ? (wallet.addr.length > 15 ? wallet.addr.slice(0, 6) + '...' + wallet.addr.slice(-4) : wallet.addr) : 'Not connected';
  const balanceText = wallet.bal + ' SOL';
  
  if (walletDisplay) walletDisplay.textContent = displayAddr;
  if (demoBalance) demoBalance.textContent = balanceText;
  if (mobileWalletDisplay) mobileWalletDisplay.textContent = wallet.addr ? wallet.addr : 'Not connected';
  if (mobileDemoBalance) mobileDemoBalance.textContent = balanceText;
  if (dashWallet) dashWallet.textContent = wallet.addr ? wallet.addr : 'Not connected';
  if (dashBal) dashBal.textContent = balanceText;
  if (dashEarnings) dashEarnings.textContent = wallet.feesCollected + ' SOL';
  if (dashActivity) dashActivity.innerHTML = wallet.activity.length ? wallet.activity.join('<br/>') : 'No activity yet';
  if (dashReputation) dashReputation.textContent = JSON.parse(localStorage.getItem('olopa_ratings')||'[]').length ? localStorage.getItem('olopa_ratings_avg') : 'No ratings yet';
}

// --- Connect Wallet ---
function initConnectWallet(){
  const connectBtn = document.getElementById('connectWallet');
  if (!connectBtn) return;
  
  connectBtn.addEventListener('click', async ()=>{
    if (!window.solanaWeb3) {
      console.log('Solana Web3 not available, using demo wallet');
      initDemoWallet();
      return;
    }
    
    await detectProvider();
    if(provider){
      try{
        const resp = await provider.connect();
        const pubkey = resp.publicKey.toString();
        const { clusterApiUrl, Connection } = window.solanaWeb3;
        connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const balLamports = await connection.getBalance(resp.publicKey);
        const bal = +(balLamports / 1e9).toFixed(4);
        wallet.addr = pubkey; 
        wallet.bal = bal;
        wallet.isPhantom = true;
        wallet.activity.unshift('Phantom connected: '+pubkey);
        localStorage.setItem('olopa_wallet', JSON.stringify(wallet));
        updateWalletUI();
        alert('Connected to Phantom on Devnet:\n' + pubkey + '\nBalance: ' + bal + ' SOL');
        console.log('Real Solana wallet connected with balance:', bal, 'SOL');
      }catch(err){
        console.error('Phantom connect error', err); alert('Phantom connect failed. Using demo wallet.');
        initDemoWallet();
      }
    } else {
      initDemoWallet();
    }
  });
}

function initDemoWallet(){
  if(!wallet.addr){ 
    wallet.addr = 'Demo_' + Math.random().toString(36).slice(2,9); 
    wallet.bal = 10 + Math.floor(Math.random()*40); 
    wallet.isPhantom = false;
    wallet.activity.unshift('Demo wallet created with ' + wallet.bal + ' SOL'); 
    localStorage.setItem('olopa_wallet', JSON.stringify(wallet)); 
    updateWalletUI(); 
    alert('Demo wallet connected!\nAddress: ' + wallet.addr + '\nBalance: ' + wallet.bal + ' SOL\n\nNote: This is for testing. Connect Phantom for real transactions.'); 
  }
}

// --- Dynamic HTML Sections ---
const sectionsHTML = `
<!-- HOME SECTION -->
<section id="home" class="min-h-screen">
  <!-- Hero Section -->
  <div class="p-8 pt-16">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6">The Future of <span class="text-purple-300">Freelancing</span> is Here</h1>
      <p class="text-xl md:text-2xl mb-4">Secure, transparent, and efficient with blockchain-powered escrow</p>
      <p class="text-lg muted mb-8 max-w-3xl mx-auto">Connect with verified talent or find your next project on the decentralized marketplace built for the Web3 era. Smart contracts ensure fair payments and transparent workflows.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button id="heroGetStarted" class="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg" style="background:linear-gradient(90deg,#a855f7,#06b6d4);color:black;">Join as Jobber</button>
        <button id="heroLogin" class="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg border border-gray-700 hover:bg-gray-800">Hire Talent</button>
      </div>
      
      <!-- Key Features -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
        <div class="glass p-6 rounded-lg">
          <div class="text-2xl mb-3">🔒</div>
          <h3 class="font-semibold mb-2">Escrow Payments</h3>
          <p class="text-sm muted">Funds secured until work delivery</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <div class="text-2xl mb-3">✓</div>
          <h3 class="font-semibold mb-2">Verified Jobbers</h3>
          <p class="text-sm muted">Talent with proven track records</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <div class="text-2xl mb-3">📋</div>
          <h3 class="font-semibold mb-2">Smart Contracts</h3>
          <p class="text-sm muted">Automated and transparent agreements</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <div class="text-2xl mb-3">⚡</div>
          <h3 class="font-semibold mb-2">Fast Delivery</h3>
          <p class="text-sm muted">Milestone-based project completion</p>
        </div>
      </div>
    </div>
  </div>

  <!-- How It Works -->
  <div class="p-8 bg-[#0a0a1a]">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div class="grid md:grid-cols-5 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
          <h3 class="font-semibold mb-2">Post Job</h3>
          <p class="text-sm muted">Employers create detailed project requirements</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
          <h3 class="font-semibold mb-2">Smart Contract</h3>
          <p class="text-sm muted">Automated escrow creates secure agreement</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
          <h3 class="font-semibold mb-2">Work Delivery</h3>
          <p class="text-sm muted">Jobbers complete milestones and submit work</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
          <h3 class="font-semibold mb-2">Payment Release</h3>
          <p class="text-sm muted">Funds released automatically upon approval</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">5</div>
          <h3 class="font-semibold mb-2">Rate & Review</h3>
          <p class="text-sm muted">Build reputation through transparent feedback</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div class="p-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Built for Everyone</h2>
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h3 class="text-2xl font-bold mb-6 text-purple-300">For Jobbers</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Secure Payments</h4>
                <p class="text-sm muted">Guaranteed payment through smart contract escrow</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Verified Profiles</h4>
                <p class="text-sm muted">Build trust with blockchain-verified achievements</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Portfolio Showcase</h4>
                <p class="text-sm muted">Display your best work and skills</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Reputation System</h4>
                <p class="text-sm muted">Transparent ratings build your professional brand</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-6 text-cyan-300">For Employers</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Verified Talent</h4>
                <p class="text-sm muted">Access pre-screened professionals with proven skills</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Smart Contract Templates</h4>
                <p class="text-sm muted">Ready-to-use agreements for common project types</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Milestone Payments</h4>
                <p class="text-sm muted">Pay as work progresses with automated releases</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 text-xs">✓</div>
              <div>
                <h4 class="font-semibold">Project Dashboard</h4>
                <p class="text-sm muted">Track progress and manage all projects in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Pricing -->
  <div class="p-8 bg-[#0a0a1a]">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Transparent Pricing</h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="glass p-8 rounded-lg">
          <h3 class="text-2xl font-bold mb-4">Free</h3>
          <div class="text-3xl font-bold mb-4">3% <span class="text-lg font-normal muted">platform fee</span></div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Basic profile</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Standard support</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Basic contract templates</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Escrow protection</li>
          </ul>
          <button class="w-full px-6 py-3 rounded-lg border border-gray-600 font-semibold">Get Started Free</button>
        </div>
        <div class="glass p-8 rounded-lg border-2 border-purple-500">
          <div class="text-purple-300 text-sm font-semibold mb-2">RECOMMENDED</div>
          <h3 class="text-2xl font-bold mb-4">Premium</h3>
          <div class="text-3xl font-bold mb-4">1.5% <span class="text-lg font-normal muted">platform fee</span></div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Verified badge</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Priority support</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Advanced templates</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Portfolio highlights</li>
            <li class="flex items-center gap-3"><span class="text-green-400">✓</span> Analytics dashboard</li>
          </ul>
          <button class="w-full px-6 py-3 rounded-lg font-semibold accent">Upgrade to Premium</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Why Solana -->
  <div class="p-8 bg-[#0a0a1a]">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Built on <span class="text-purple-300">Solana</span></h2>
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <div class="text-center">
          <div class="text-3xl mb-4">⚡</div>
          <h3 class="font-semibold mb-3">Lightning Fast</h3>
          <p class="muted">65,000+ transactions per second with sub-second finality</p>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-4">💰</div>
          <h3 class="font-semibold mb-3">Ultra-Low Fees</h3>
          <p class="muted">Transaction costs under $0.01, making micropayments viable</p>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-4">🔧</div>
          <h3 class="font-semibold mb-3">Developer Friendly</h3>
          <p class="muted">Rust-based programs with comprehensive tooling ecosystem</p>
        </div>
      </div>
      <div class="glass p-6 rounded-lg">
        <h3 class="font-semibold mb-4 text-center">Technical Architecture</h3>
        <div class="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-semibold mb-2">Smart Contract Escrow</h4>
            <p class="muted">Program-derived addresses (PDAs) secure funds until delivery confirmation</p>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Devnet to Mainnet</h4>
            <p class="muted">Currently testing on devnet with planned mainnet deployment for production</p>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Phantom Integration</h4>
            <p class="muted">Seamless wallet connection with fallback demo mode for accessibility</p>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Milestone Payments</h4>
            <p class="muted">Automated SOL releases based on deliverable approval workflow</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- FAQ -->
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div class="space-y-6">
        <div class="glass p-6 rounded-lg">
          <h3 class="font-semibold mb-2">How does the escrow system work?</h3>
          <p class="muted">Funds are held in a smart contract until work is delivered and approved. This protects both parties and ensures fair payment.</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <h3 class="font-semibold mb-2">Do I need a crypto wallet?</h3>
          <p class="muted">Yes, you'll need a Solana wallet like Phantom to receive payments. Don't have one? We'll guide you through the setup process.</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <h3 class="font-semibold mb-2">What if there's a dispute?</h3>
          <p class="muted">Our platform includes dispute resolution mechanisms and community arbitration to ensure fair outcomes for all parties.</p>
        </div>
        <div class="glass p-6 rounded-lg">
          <h3 class="font-semibold mb-2">How do I get verified?</h3>
          <p class="muted">Complete projects successfully, maintain high ratings, and provide portfolio samples. Verification helps you stand out to employers.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- LOGIN SECTION -->
<section id="login" class="p-8 hidden">
  <div class="max-w-md mx-auto glass p-8 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Login to Olopa</h2>
    <form id="loginForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input id="loginEmail" type="email" placeholder="Enter your email" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input id="loginPassword" type="password" placeholder="Enter your password" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
      </div>
      <button type="submit" class="w-full px-4 py-3 rounded-lg font-semibold" style="background:linear-gradient(90deg,#06b6d4,#a855f7);color:black;">Login</button>
    </form>
    <div class="mt-6 text-center">
      <p class="text-sm muted">Don't have an account? <button id="goToRegister" class="text-purple-400 hover:text-purple-300">Register here</button></p>
      <p class="text-sm muted mt-2">Or connect your wallet to get started immediately</p>
    </div>
  </div>
</section>

<!-- REGISTER SECTION -->
<section id="register" class="p-8 hidden">
  <div class="max-w-md mx-auto glass p-8 rounded-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Join Olopa</h2>
    <form id="registerForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Full Name</label>
        <input id="regName" type="text" placeholder="Enter your full name" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input id="regEmail" type="email" placeholder="Enter your email" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input id="regPassword" type="password" placeholder="Create a password" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Role</label>
        <select id="regRole" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required>
          <option value="">Select your role</option>
          <option value="freelancer">Freelancer</option>
          <option value="employer">Employer</option>
        </select>
      </div>
      <button type="submit" class="w-full px-4 py-3 rounded-lg font-semibold" style="background:linear-gradient(90deg,#06b6d4,#a855f7);color:black;">Sign Up</button>
    </form>
    <div class="mt-6 text-center">
      <p class="text-sm muted">Already have an account? <button id="goToLogin" class="text-purple-400 hover:text-purple-300">Login here</button></p>
    </div>
  </div>
</section>

<!-- CONTRACTS SECTION -->
<section id="contracts" class="p-4 sm:p-8 hidden">
  <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <div class="glass p-6 rounded-lg">
      <h2 class="text-2xl font-bold">Create Contract</h2>
      <form id="createForm" class="mt-4 space-y-4">
        <input id="cTitle" placeholder="Title" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
        <textarea id="cDesc" placeholder="Description" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" rows="4"></textarea>
        <input id="cAmount" type="number" placeholder="Amount (SOL)" class="w-full p-3 rounded-lg bg-[#071022] border border-gray-700" required />
        <button type="submit" class="px-4 py-2 rounded-lg" style="background:linear-gradient(90deg,#06b6d4,#a855f7);color:black;font-weight:700;">Create</button>
      </form>
    </div>
    <div class="glass p-6 rounded-lg">
      <h2 class="text-2xl font-bold">Active Contracts</h2>
      <div id="contractsList" class="mt-4 space-y-3 max-h-[60vh] overflow-auto"></div>
    </div>
  </div>
</section>

<section id="market" class="p-8 hidden">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold">Marketplace</h2>
    <div id="jobsGrid" class="grid md:grid-cols-3 gap-4 mt-4"></div>
  </div>
</section>

<section id="dashboard" class="p-4 sm:p-8 hidden">
  <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <div class="glass p-4 rounded-lg">
      <h3 class="font-semibold">Wallet</h3>
      <p id="dashWallet" class="muted text-sm">Not connected</p>
      <p>Balance: <span id="dashBal">0 SOL</span></p>
    </div>
    <div class="glass p-4 rounded-lg">
      <h3 class="font-semibold">Earnings</h3>
      <p class="mt-2 font-bold" id="dashEarnings">0 SOL</p>
    </div>
    <div class="glass p-4 rounded-lg">
      <h3 class="font-semibold">Reputation</h3>
      <p id="dashReputation" class="muted text-sm">No ratings yet</p>
    </div>
    <div class="glass p-4 rounded-lg">
      <h3 class="font-semibold">Activity</h3>
      <div id="dashActivity" class="mt-2 text-sm muted">No activity yet</div>
    </div>
  </div>
</section>

<section id="about" class="p-8 hidden">
  <div class="max-w-4xl mx-auto glass p-6 rounded-lg">
    <h2 class="text-2xl font-bold">About Olopa</h2>
    <p class="mt-2 muted">Olopa is a secure contracts hub for freelancers and employers. Demo + Devnet features included.</p>
  </div>
</section>
`;

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  
  if (mobileMenuBtn && mobileMenu && closeMobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
    
    closeMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    });
    
    // Close menu when navigation item is clicked
    mobileMenu.querySelectorAll('.nav').forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Proper DOM initialization
document.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.querySelector('main');
  console.log('Main element found:', mainElement);
  
  if (mainElement) {
    // Inject all sections
    mainElement.innerHTML = sectionsHTML;
    console.log('Content injected successfully');
    
    // Add visual indicator that JS loaded
    document.title = document.title + ' ✓';

    // Re-initialize navigation after injecting HTML
    document.querySelectorAll('.nav').forEach(btn => btn.addEventListener('click', ()=> show(btn.dataset.target)));
    document.querySelectorAll('[data-target]').forEach(btn => btn.addEventListener('click', ()=> show(btn.dataset.target)));
    show('home');

    // Initialize all components AFTER sections are injected
    updateWalletUI();
    initConnectWallet();
    initCreateForm();
    initHeroButton();
    initAuthForms();
    initMobileMenu();
    
    // Render contracts AFTER all sections exist
    renderContracts();
  } else {
    console.error('Main element not found!');
  }
});

// --- Backend Fetch Functions ---
async function fetchContracts(){
  try{
    const res = await fetch('/api/contracts');
    return await res.json();
  }catch(err){ console.error(err); return []; }
}

async function createContract(data){
  try{
    const res = await fetch('/api/contracts', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    return await res.json();
  }catch(err){ console.error(err); alert('Contract creation failed'); }
}

// --- Render Contracts ---
async function renderContracts(){
  const list = document.getElementById('contractsList');
  list.innerHTML = 'Loading...';
  const contracts = await fetchContracts();
  if(!contracts.length) list.innerHTML = '<div class="muted">No contracts yet</div>';
  else{
    list.innerHTML = '';
    contracts.reverse().forEach(c=>{
      const el = document.createElement('div');
      el.className = 'p-4 glass rounded-lg';
      
      const titleDiv = document.createElement('div');
      titleDiv.className = 'font-semibold';
      titleDiv.textContent = c.title;
      
      const descDiv = document.createElement('div');
      descDiv.className = 'muted text-sm';
      descDiv.textContent = c.description || '';
      
      const amountDiv = document.createElement('div');
      amountDiv.className = 'mt-2 text-sm muted';
      amountDiv.textContent = `Amount: ${c.amount} SOL • Status: `;
      
      const statusSpan = document.createElement('span');
      statusSpan.className = 'badge';
      statusSpan.textContent = c.status;
      amountDiv.appendChild(statusSpan);
      
      el.appendChild(titleDiv);
      el.appendChild(descDiv);
      el.appendChild(amountDiv);
      list.appendChild(el);
    });
  }
}

// --- Solana Transaction Functions ---
async function createEscrowTransaction(amount, recipientAddress) {
  if (!window.solanaWeb3 || !provider || !connection) {
    throw new Error('Solana wallet not connected');
  }

  try {
    const { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } = window.solanaWeb3;
    
    const fromPubkey = new PublicKey(wallet.addr);
    const toPubkey = new PublicKey(recipientAddress);
    const lamports = amount * LAMPORTS_PER_SOL;
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      }),
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;
    
    // Sign and send transaction
    const signedTransaction = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

async function refreshWalletBalance() {
  if (wallet.isPhantom && connection && wallet.addr) {
    try {
      const { PublicKey } = window.solanaWeb3;
      const pubkey = new PublicKey(wallet.addr);
      const balance = await connection.getBalance(pubkey);
      wallet.bal = +(balance / 1e9).toFixed(4);
      localStorage.setItem('olopa_wallet', JSON.stringify(wallet));
      updateWalletUI();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }
}

// --- Create Contract Form ---
function initCreateForm(){
  const createForm = document.getElementById('createForm');
  if (!createForm) return;
  
  createForm.addEventListener('submit', async function(e){
    e.preventDefault();
    if(!wallet.addr) return alert('Connect wallet first');

    const title = document.getElementById('cTitle').value.trim();
    const desc = document.getElementById('cDesc').value.trim();
    const amount = parseFloat(document.getElementById('cAmount').value) || 0;

    if (amount <= 0) return alert('Please enter a valid amount');
    if (wallet.isPhantom && amount > wallet.bal) {
      return alert(`Insufficient balance. You have ${wallet.bal} SOL but need ${amount} SOL`);
    }

    try {
      // SECURITY: Currently using simulation mode for contract funding
      // Real escrow smart contract implementation is required for production
      let txSignature = null;
      let escrowAddress = null;
      
      if (wallet.isPhantom && amount > 0) {
        // Simulate contract funding without actual SOL transfer
        alert('Simulating contract creation...\n\nNote: Full escrow functionality requires smart contract implementation.\nYour SOL balance will not be affected in this demo.');
        
        // Generate simulated transaction signature for demonstration
        txSignature = 'SIMULATED_' + Math.random().toString(36).slice(2, 15);
        escrowAddress = 'SIMULATED_ESCROW_' + Math.random().toString(36).slice(2, 10);
        
        wallet.activity.unshift(`Contract created (simulated): ${amount} SOL`);
        console.log('Contract simulation - no real SOL transferred');
      } else {
        // Demo wallet functionality
        if (wallet.bal < amount) return alert('Insufficient demo balance');
        wallet.bal -= amount;
        wallet.activity.unshift(`Demo contract created: ${amount} SOL`);
        escrowAddress = 'DEMO_ESCROW_' + Math.random().toString(36).slice(2, 10);
      }

      const contract = await createContract({
        title,
        description: desc,
        employer: wallet.addr,
        amount,
        transactionSignature: txSignature,
        escrowAddress: escrowAddress,
        status: txSignature ? 'simulated' : 'created'
      });

      localStorage.setItem('olopa_wallet', JSON.stringify(wallet));
      updateWalletUI();
      
      const message = txSignature 
        ? `Contract created in simulation mode!\nSimulated TX: ${txSignature}\n\nNote: Real escrow requires smart contract deployment.`
        : `Demo contract created: ${contract.title}`;
      
      alert(message);
      document.getElementById('createForm').reset();
      renderContracts();
    } catch (error) {
      console.error('Contract creation failed:', error);
      alert('Contract creation failed: ' + error.message);
    }
  });
}

// --- Hero buttons ---
function initHeroButton(){
  const heroGetStarted = document.getElementById('heroGetStarted');
  const heroLogin = document.getElementById('heroLogin');
  
  if (heroGetStarted) {
    heroGetStarted.addEventListener('click', ()=> show('register'));
  }
  if (heroLogin) {
    heroLogin.addEventListener('click', ()=> show('login'));
  }
}

// --- Login/Register Functions ---
async function loginUser(email, password) {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('olopa_user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

async function registerUser(name, email, password, role) {
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('olopa_user', JSON.stringify(data));
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
}

function initAuthForms() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        await loginUser(email, password);
        alert('Login successful! Welcome back.');
        show('dashboard');
      } catch (err) {
        alert('Login failed: ' + err.message);
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const role = document.getElementById('regRole').value;
      try {
        const data = await registerUser(name, email, password, role);
        localStorage.setItem('olopa_user', JSON.stringify(data.user));
        alert('Registration successful! Welcome to Olopa.');
        show('dashboard');
      } catch (err) {
        alert('Registration failed: ' + err.message);
      }
    });
  }

  // Navigation between login/register
  const goToRegister = document.getElementById('goToRegister');
  const goToLogin = document.getElementById('goToLogin');
  if (goToRegister) {
    goToRegister.addEventListener('click', () => show('register'));
  }
  if (goToLogin) {
    goToLogin.addEventListener('click', () => show('login'));
  }
}

// --- Initial Load ---
// renderContracts() is now called after DOM initialization