'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { EYE_COLORS, HAIR_COLORS, ETHNICITIES } from '@/lib/constants';
import { ModelFilters as ModelFiltersType } from '@/types';
import { cn } from '@/lib/utils';

interface ModelFiltersProps {
  filters: ModelFiltersType;
  onFiltersChange: (filters: ModelFiltersType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ModelFilters({ filters, onFiltersChange, isOpen, onToggle }: ModelFiltersProps) {
  const updateFilter = (key: keyof ModelFiltersType, value: string | number | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
        <Input
          type="text"
          placeholder="Search models..."
          value={filters.search || ''}
          onChange={e => updateFilter('search', e.target.value)}
          className="pl-10 bg-[#1A1A1A] border-[#333333] text-[#F5F5F5] focus:border-[#D4AF37]"
        />
      </div>

      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={onToggle}
        className="w-full border-[#333333] text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] hover:border-[#D4AF37]/50"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 px-1.5 py-0.5 bg-[#D4AF37] text-[#0A0A0A] text-xs rounded-full">
            Active
          </span>
        )}
        <ChevronDown className={cn('w-4 h-4 ml-auto transition-transform', isOpen && 'rotate-180')} />
      </Button>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-4 border-t border-[#333333]">
          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-[#A0A0A0] text-sm">Sort By</Label>
            <Select
              value={filters.sortBy || 'newest'}
              onValueChange={value => updateFilter('sortBy', value)}
            >
              <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#F5F5F5]">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-[#A0A0A0] text-sm">
              Price Range: ${filters.minPrice || 0} - ${filters.maxPrice || 100}
            </Label>
            <div className="px-2">
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 100]}
                onValueChange={([min, max]) => {
                  updateFilter('minPrice', min);
                  updateFilter('maxPrice', max);
                }}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
          </div>

          {/* Eye Color */}
          <div className="space-y-2">
            <Label className="text-[#A0A0A0] text-sm">Eye Color</Label>
            <Select
              value={filters.eyeColor || ''}
              onValueChange={value => updateFilter('eyeColor', value || undefined)}
            >
              <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#F5F5F5]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                <SelectItem value="">Any</SelectItem>
                {EYE_COLORS.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hair Color */}
          <div className="space-y-2">
            <Label className="text-[#A0A0A0] text-sm">Hair Color</Label>
            <Select
              value={filters.hairColor || ''}
              onValueChange={value => updateFilter('hairColor', value || undefined)}
            >
              <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#F5F5F5]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                <SelectItem value="">Any</SelectItem>
                {HAIR_COLORS.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ethnicity */}
          <div className="space-y-2">
            <Label className="text-[#A0A0A0] text-sm">Ethnicity</Label>
            <Select
              value={filters.ethnicity || ''}
              onValueChange={value => updateFilter('ethnicity', value || undefined)}
            >
              <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-[#F5F5F5]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                <SelectItem value="">Any</SelectItem>
                {ETHNICITIES.map(ethnicity => (
                  <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Free Trial Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-[#A0A0A0] text-sm">Has Free Trial</Label>
            <Button
              variant={filters.hasFreeTrial ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('hasFreeTrial', !filters.hasFreeTrial)}
              className={cn(
                filters.hasFreeTrial 
                  ? 'bg-[#D4AF37] text-[#0A0A0A]' 
                  : 'border-[#333333] text-[#A0A0A0]'
              )}
            >
              {filters.hasFreeTrial ? 'Yes' : 'No'}
            </Button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full border-[#8B0000]/50 text-[#F5F5F5] hover:bg-[#8B0000]/20 hover:border-[#8B0000]"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
