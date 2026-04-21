
"use client";

import { useState } from "react";
import { 
  acceptedWasteTypes, 
  checklistItems, 
  pickupSlots, 
  rewardItems 
} from "@/lib/greenloop-data";
import { CameraScanner } from "@/components/camera-scanner";
import { aiWasteDetectionUpload, type AiWasteDetectionUploadOutput } from "@/ai/flows/ai-waste-detection-upload-flow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  Home, 
  Recycle, 
  Gift, 
  User, 
  CheckCircle2, 
  ArrowLeft, 
  Camera, 
  Upload, 
  MapPin, 
  Clock, 
  Trees,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Trophy,
  Leaf,
  Coins
} from "lucide-react";

type Screen = "home" | "checklist" | "scan-choice" | "camera" | "upload" | "booking" | "confirmation" | "rewards" | "profile";

export default function GreenLoopApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [points, setPoints] = useState(840);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [scanResult, setScanResult] = useState<AiWasteDetectionUploadOutput | null>(null);
  const [selectedSlot, setSelectedSlot] = useState(pickupSlots[2]);
  const [selectedDate, setSelectedDate] = useState("April 22, 2026");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rewardCode, setRewardCode] = useState<{ title: string; code: string } | null>(null);
  const { toast } = useToast();

  const nextTierPoints = 1000;
  const progress = (points / nextTierPoints) * 100;

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = checklistItems.every(item => checks[item.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await aiWasteDetectionUpload({ photoDataUri: dataUri });
        setScanResult(result);
        navigate("booking");
      } catch (err: any) {
        console.error("Upload error:", err);
        toast({
          variant: "destructive",
          title: "AI Scan Error",
          description: "Could not process image. Please check your connection or quota.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLiveDetection = (result: any) => {
    setScanResult(result);
    navigate("booking");
  };

  const renderHome = () => (
    <div className="pb-24 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary font-headline">GreenLoop</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Eco Hero! 👋</p>
        </div>
        <div className="flex items-center gap-2" onClick={() => navigate("profile")}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm cursor-pointer">JD</div>
        </div>
      </header>

      <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-primary/5 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-headline text-primary">{points}</span>
                <span className="text-sm font-medium text-muted-foreground">pts</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-[10px] mb-1">Silver Tier</Badge>
              <p className="text-xs text-muted-foreground">{nextTierPoints - points} pts to Gold 🏆</p>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-secondary mb-4" />
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Progress to Next Tier</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 px-2 font-headline">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={() => navigate("checklist")}
            className="w-full bg-primary text-white rounded-2xl h-14 font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <Camera size={20} />
            Scan Waste to Earn
          </button>
          <button 
            onClick={() => navigate("rewards")}
            className="w-full border-2 border-primary/20 bg-white text-primary rounded-2xl h-14 font-bold flex items-center justify-center gap-2"
          >
            <Gift size={20} />
            Browse Rewards
          </button>
        </div>
      </section>

      {/* Point Guide Section */}
      <section className="mb-8">
        <div className="bg-[#FFFCEB] rounded-[2.5rem] p-6 border border-[#F5E6A3]/30">
          <div className="flex items-center gap-2 mb-3">
             <Coins className="text-yellow-600" size={20} />
             <h2 className="text-lg font-bold font-headline">Point Guide</h2>
          </div>
          <p className="text-[11px] text-muted-foreground mb-5 leading-relaxed">
            Earn points for every item you recycle. Points can be exchanged for exclusive rewards and vouchers!
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Plastics", points: "10-20 pts", icon: "🧴" },
              { label: "Paper", points: "5-15 pts", icon: "📦" },
              { label: "Metals", points: "20-30 pts", icon: "🥫" },
              { label: "E-Waste", points: "50-100 pts", icon: "📱" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-[11px] font-bold">{item.label}</p>
                  <p className="text-[10px] text-green-600 font-medium">{item.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 px-2 font-headline">Waste We Accept</h2>
        <div className="grid grid-cols-2 gap-3">
          {acceptedWasteTypes.map(type => (
            <div key={type.id} className="bg-white p-5 rounded-[2rem] border border-primary/5 shadow-sm flex flex-col items-center text-center">
              <span className="text-4xl mb-3">{type.icon}</span>
              <span className="font-bold text-sm block mb-1">{type.title}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {type.description.split('. ')[0]}...
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderChecklist = () => (
    <div className="pb-24 pt-6 px-4 animate-in slide-in-from-right-4">
      <button onClick={() => navigate("home")} className="mb-6 flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary border-none">Step 1 of 3</Badge>
        <h2 className="text-2xl font-bold font-headline">Quality Checklist</h2>
        <p className="text-muted-foreground text-sm">Help us ensure your waste can be effectively recycled.</p>
      </div>

      <div className="space-y-4 mb-8">
        {checklistItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggleCheck(item.id)}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              checks[item.id] ? "border-primary bg-primary/5" : "border-muted bg-white"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
              checks[item.id] ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              {checks[item.id] ? <CheckCircle2 size={24} /> : item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        disabled={!allChecked}
        onClick={() => navigate("scan-choice")}
        className={`w-full btn-primary ${!allChecked ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
      >
        Continue to Scanning
      </button>
    </div>
  );

  const renderScanChoice = () => (
    <div className="pb-24 pt-6 px-4 animate-in slide-in-from-right-4">
      <button onClick={() => navigate("checklist")} className="mb-6 flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <ArrowLeft size={16} /> Back to Checklist
      </button>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold font-headline">AI Detection</h2>
        <p className="text-muted-foreground text-sm">Choose how you want to detect your waste.</p>
      </div>

      <div className="space-y-6">
        <button 
          onClick={() => navigate("camera")}
          className="w-full p-8 rounded-[2rem] border-2 border-primary/20 bg-white flex flex-col items-center gap-4 hover:border-primary transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <Camera size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Live Camera Scan</h3>
            <p className="text-xs text-muted-foreground">Detect waste in real-time</p>
          </div>
        </button>

        <label className="w-full p-8 rounded-[2rem] border-2 border-dashed border-muted bg-white flex flex-col items-center gap-4 cursor-pointer hover:border-primary transition-all">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Upload Photo</h3>
            <p className="text-xs text-muted-foreground">Select a photo from your gallery</p>
          </div>
        </label>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="pb-24 pt-6 px-4 animate-in slide-in-from-right-4">
      <button onClick={() => navigate("scan-choice")} className="mb-6 flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <ArrowLeft size={16} /> Back to Scanning
      </button>

      <div className="mb-6">
        <Badge className="mb-2 bg-primary/10 text-primary border-none">Step 2 of 3</Badge>
        <h2 className="text-2xl font-bold font-headline">Detection Summary</h2>
      </div>

      {scanResult && (
        <Card className="rounded-[1.5rem] border-none shadow-md bg-white mb-6 overflow-hidden">
          <div className="bg-primary/5 p-4 border-b border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-primary">Points to be Earned</span>
              <span className="text-2xl font-bold text-primary">+{scanResult.totalPoints} pts</span>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3 mb-4">
              {scanResult.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px]">x{item.quantity} {item.unit}</Badge>
                    <span className="text-xs font-bold text-primary">+{item.points}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground bg-secondary/50 p-3 rounded-xl italic">
              "{scanResult.summary}"
            </p>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-bold mb-4 font-headline">Schedule Pickup</h2>
      
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">Select Date</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {["April 22, 2026", "April 23, 2026", "April 24, 2026"].map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-none px-5 py-3 rounded-2xl border-2 transition-all ${
                selectedDate === date 
                ? "border-primary bg-primary/5 text-primary font-bold shadow-sm" 
                : "border-muted bg-white text-muted-foreground"
              }`}
            >
              <div className="text-[10px] uppercase opacity-60 mb-1">{date.split(' ')[0]}</div>
              <div className="text-sm">{date.split(' ')[1].replace(',', '')}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-1">Select Time Slot</h3>
        <div className="space-y-3">
          {pickupSlots.map((slot) => (
            <div
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedSlot.id === slot.id 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-muted bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedSlot.id === slot.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold">{slot.label}</p>
                  <p className="text-[10px] text-muted-foreground">{slot.description}</p>
                </div>
              </div>
              {slot.bonus > 0 && (
                <Badge className="bg-accent text-accent-foreground border-none text-[10px]">
                  +{slot.bonus} pts Bonus
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="rounded-[1.5rem] border-none shadow-sm bg-white mb-8">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold">42/5 Sukhumvit Soi 24</p>
            <p className="text-[10px] text-muted-foreground">Bangkok, 10110</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold">Edit</Button>
        </CardContent>
      </Card>

      <button 
        onClick={() => {
          setPoints(prev => prev + (scanResult?.totalPoints || 0) + selectedSlot.bonus);
          navigate("confirmation");
        }}
        className="w-full btn-primary"
      >
        Confirm Pickup & Earn 🌿
      </button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="pb-24 pt-12 px-6 animate-in zoom-in-95 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
        <CheckCircle2 size={56} />
      </div>
      
      <h2 className="text-3xl font-bold font-headline mb-2 tracking-tight">Confirmed!</h2>
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
        Our driver will arrive on <strong>{selectedDate}</strong>.
      </p>

      <Card className="w-full rounded-[2rem] p-8 border-none shadow-2xl bg-white mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Your Pickup Pass</p>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Booking ID</span>
          <span className="text-xl font-bold font-headline tracking-[4px]">GL-992-883</span>
        </div>
      </Card>

      <button onClick={() => navigate("home")} className="w-full btn-primary">
        Back to Dashboard
      </button>
    </div>
  );

  const renderRewards = () => (
    <div className="pb-24 pt-6 px-4 animate-in slide-in-from-right-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-headline">Eco Rewards</h1>
        <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
          <span className="text-lg font-bold text-primary">{points} pts</span>
        </div>
      </header>

      <section className="space-y-4">
        {rewardItems.map(reward => (
          <div 
            key={reward.id} 
            className="bg-white p-4 rounded-[1.5rem] border shadow-sm flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">
              {reward.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">{reward.title}</h3>
              <p className="text-[10px] text-muted-foreground mb-2">{reward.description}</p>
              <Button 
                disabled={points < reward.cost || reward.locked}
                size="sm" 
                className="h-7 px-4 rounded-full text-[10px] font-bold"
                onClick={() => {
                  setPoints(prev => prev - reward.cost);
                  setRewardCode({ title: reward.title, code: reward.code });
                  toast({
                    title: "Reward Redeemed!",
                    description: `You spent ${reward.cost} pts on ${reward.title}.`,
                  });
                }}
              >
                {reward.locked ? "Locked" : `Redeem ${reward.cost} pts`}
              </Button>
            </div>
          </div>
        ))}
      </section>

      {rewardCode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <Card className="w-full max-w-sm rounded-[2rem] p-8 text-center bg-white shadow-2xl">
              <h3 className="text-2xl font-bold font-headline mb-2">{rewardCode.title}</h3>
              <div className="bg-secondary p-5 rounded-2xl mb-8">
                <span className="text-2xl font-bold tracking-[4px] text-primary">{rewardCode.code}</span>
              </div>
              <Button onClick={() => setRewardCode(null)} className="w-full btn-primary">Awesome!</Button>
           </Card>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="pb-24 pt-6 px-4 animate-in slide-in-from-bottom-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-headline text-foreground">Eco Profile</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings size={20} className="text-muted-foreground" />
        </Button>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-4 border-white shadow-lg">
            JD
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-white">
            <Trophy size={14} className="text-accent-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-sm text-muted-foreground">Eco Hero Level 12</p>
        <Badge className="mt-2 bg-primary/10 text-primary border-none px-3 py-1">🌿 2.4 Tons CO2 Saved</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <Card className="rounded-2xl border-none shadow-sm bg-white p-3 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Rank</p>
          <p className="text-lg font-bold text-primary">#42</p>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-white p-3 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Impact Level</p>
          <p className="text-lg font-bold text-primary">High</p>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-white p-3 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Badges</p>
          <p className="text-lg font-bold text-primary">12</p>
        </Card>
      </div>

      <section className="mb-8 overflow-x-auto pb-2">
        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 px-2">Achievements</h3>
        <div className="flex gap-4 px-2">
          {[
            { icon: Leaf, label: "Nature Lover", color: "text-green-500" },
            { icon: Recycle, label: "Pro Sorter", color: "text-blue-500" },
            { icon: Trophy, label: "Top 1%", color: "text-yellow-500" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[80px]">
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-2 ${item.color}`}>
                <item.icon size={28} />
              </div>
              <span className="text-[10px] font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 px-2">Account</h3>
        <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
          <div className="divide-y">
            {[
              { icon: User, label: "Personal Information" },
              { icon: Bell, label: "Notifications" },
              { icon: Shield, label: "Privacy & Security" },
              { icon: HelpCircle, label: "Help & Support" }
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Button variant="ghost" className="w-full h-14 rounded-2xl text-destructive hover:bg-destructive/5 font-bold mb-4">
        <LogOut size={20} className="mr-2" /> Sign Out
      </Button>
    </div>
  );

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#F7FAF9] relative font-body shadow-2xl">
      <div className="min-h-screen">
        {currentScreen === "home" && renderHome()}
        {currentScreen === "checklist" && renderChecklist()}
        {currentScreen === "scan-choice" && renderScanChoice()}
        {currentScreen === "booking" && renderBooking()}
        {currentScreen === "confirmation" && renderConfirmation()}
        {currentScreen === "rewards" && renderRewards()}
        {currentScreen === "profile" && renderProfile()}
        
        {currentScreen === "camera" && (
          <div className="animate-in slide-in-from-right-4">
            <header className="p-4 flex items-center gap-4 bg-background border-b sticky top-0 z-10">
              <button onClick={() => navigate("scan-choice")} className="p-2">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-bold font-headline">Live Scan</h1>
            </header>
            <div className="p-4">
              <CameraScanner 
                active={currentScreen === "camera"} 
                onDetection={handleLiveDetection}
                onScanningStateChange={setIsAnalyzing}
              />
            </div>
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="spinner mb-6" />
          <h3 className="text-xl font-bold mb-2 font-headline">AI is Analyzing...</h3>
          <p className="text-sm text-white/70">Identifying waste and calculating points.</p>
        </div>
      )}

      <nav className="bottom-nav rounded-t-[2.5rem] bg-white">
        <button onClick={() => navigate("home")} className={`nav-item ${currentScreen === "home" ? "active" : ""}`}>
          <Home size={22} />
          <span className="mt-1">Home</span>
        </button>
        <button onClick={() => navigate("checklist")} className={`nav-item ${["checklist", "scan-choice", "camera", "upload", "booking"].includes(currentScreen) ? "active" : ""}`}>
          <Recycle size={22} />
          <span className="mt-1">Submit</span>
        </button>
        <button onClick={() => navigate("rewards")} className={`nav-item ${currentScreen === "rewards" ? "active" : ""}`}>
          <Gift size={22} />
          <span className="mt-1">Rewards</span>
        </button>
        <button onClick={() => navigate("profile")} className={`nav-item ${currentScreen === "profile" ? "active" : ""}`}>
          <User size={22} />
          <span className="mt-1">Profile</span>
        </button>
      </nav>
      <Toaster />
    </main>
  );
}
