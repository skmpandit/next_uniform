import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import blackbg_logo from '@/assets/backbglogo.png';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSubscribeNewsletter } from '@/hooks/use-subscribe-newsletter';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { toast } = useToast();
  const { mutateAsync, isPending } = useSubscribeNewsletter();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      toast({ title: 'Please enter a valid email', variant: 'destructive' });
      return;
    }
    try {
      await mutateAsync(newsletterEmail);
      toast({
        title: 'Subscribed successfully!',
        description: "Thanks — we'll keep you posted.",
      });
      setNewsletterEmail('');
    } catch (err: any) {
      toast({
        title: 'Subscription failed',
        description: `${err?.code || ''} ${err?.message || ''}`.trim() || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {/* Grid: mobile-first */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <img src={blackbg_logo} alt="NextUniform logo" className="h-[72px] sm:h-[80px] md:h-[90px] w-auto" />
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Next Uniform — quality uniforms & workwear. Durable, comfortable and tailored for your team.
            </p>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity">New Arrivals</Link>
              </li>
              <li>
                <Link to="/products?category=Industrial" className="opacity-80 hover:opacity-100 transition-opacity">Industrial</Link>
              </li>
              <li>
                <Link to="/products?category=Hospital" className="opacity-80 hover:opacity-100 transition-opacity">Hospital</Link>
              </li>
              <li>
                <Link to="/products?category=Hotel" className="opacity-80 hover:opacity-100 transition-opacity">Hotel</Link>
              </li>
              <li>
                <Link to="/products?category=Corporate" className="opacity-80 hover:opacity-100 transition-opacity">Corporate</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="opacity-80 hover:opacity-100 transition-opacity">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/returns" className="opacity-80 hover:opacity-100 transition-opacity">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/sizeguide" className="opacity-80 hover:opacity-100 transition-opacity">Size Guide</Link>
              </li>
              <li>
                <Link to="/faq" className="opacity-80 hover:opacity-100 transition-opacity">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay Connected</h4>

            {/* newsletter form - accessible */}
            <form 
              onSubmit={handleSubscribe} 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md w-full"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-full bg-white/5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Email for newsletter"
              />
              <Button
                type="submit"
                className="rounded-full px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                disabled={isPending}
              >
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2 opacity-90">
                <Phone className="h-4 w-4" />
                <span>+91 96740 84559</span>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <Mail className="h-4 w-4" />
                <span>admin@nextuniform@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <MapPin className="h-4 w-4" />
                <span>11/A Rangal Street, Khidirpore, Kolkata - 700023</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom row: stacked on small, horizontal on md+ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-80">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Next Uniform. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
            <Link to="/terms-and-conditions" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/cookie-policy" className="hover:opacity-100 transition-opacity">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;