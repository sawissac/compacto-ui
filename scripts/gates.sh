#!/usr/bin/env bash
# Source-level CI gates for @compacto/ui.
#
# These three checks are the mechanical enforcement of the token decisions made
# when the library was extracted. Each MUST return zero matches; any hit fails
# the build. They run in CI and are worth running locally before a commit.
#
#   1. shadcn semantic tokens — the library speaks --app-* only. A semantic
#      utility here would silently depend on the consumer shipping
#      compat-shadcn.css, which is scheduled for deletion in v2.
#   2. `dark:` variants — the ten palettes are complete palettes, not a
#      light/dark pair. --app-* already resolves correctly for the active
#      palette, so a dark: clause can only drift away from it.
#   3. colorless border utilities — the consuming apps have a
#      `@layer base { * { @apply border-border } }` rule that silently supplies
#      a border color. This library has no such rule, so a bare `border` falls
#      back to currentColor and paints the wrong thing.
#
# Matching runs in perl rather than grep because the boundaries matter: `\b`
# alone makes `border-app-border-accent` look like a `border-accent` hit, so a
# token must not be preceded by another `-segment`. Comment-only lines are
# skipped — prose naming a banned class (as the migration notes do) is
# documentation, not a violation.
set -uo pipefail

cd "$(dirname "$0")/.."
SRC=packages/ui/src
status=0

# compat-shadcn.css is the one file whose entire job is to define the semantic
# variables, so it is exempt from gate 1 by design.
EXEMPT='packages/ui/src/styles/compat-shadcn.css'

# run_gate <label> <pattern> <hint> <root> [absolving-pattern]
#
# A line is a hit when it matches <pattern>. When an absolving pattern is
# given, a line that also matches THAT is not a hit — which is how gate 3 lets
# `border border-app-border` through while still catching a lone `border`.
run_gate() {
  local label="$1" pattern="$2" hint="$3" root="$4" absolve="${5-}"
  echo "$label"
  local hits
  hits=$(find "$root" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) \
    ! -path "$EXEMPT" -print0 |
    PATTERN="$pattern" ABSOLVE="$absolve" perl -0777 -ne '
      my $re  = qr/$ENV{PATTERN}/;
      my $abs = length $ENV{ABSOLVE} ? qr/$ENV{ABSOLVE}/ : undef;
      for my $f (split /\0/) {
        open my $fh, "<", $f or next;
        local $/ = "\n";
        while (my $line = <$fh>) {
          # Skip comment-only lines: prose naming a banned class is not a use.
          next if $line =~ m{^\s*(\*|//|/\*)};
          next unless $line =~ $re;
          next if defined($abs) && $line =~ $abs;
          chomp $line;
          $line =~ s/^\s+//;
          $line = substr($line, 0, 150) . " …" if length($line) > 150;
          print "  $f:$.  $line\n";
        }
        close $fh;
      }
    ')
  if [ -n "$hits" ]; then
    printf '%s\n' "$hits"
    printf '\033[31mGATE FAILED\033[0m — %s\n\n' "$hint"
    status=1
  fi
}

# A utility prefix, then a semantic color name, with neither side glued to
# another word or "-segment". The leading (?<![-\w]) is what keeps
# `border-app-border-accent` from reading as a `border-accent` hit.
SEMANTIC='(?<![-\w])(?:bg|text|border|ring|outline|fill|stroke|from|to|via|divide|placeholder|caret|accent)-(?:primary|secondary|muted|accent|popover|card|background|foreground|border|input|ring|destructive|sidebar)(?![-\w])'
run_gate "gate 1/3: no shadcn semantic tokens" "$SEMANTIC" \
  "semantic tokens found above — convert to the --app-* vocabulary" "$SRC"

run_gate "gate 2/3: no dark: variants" '(?<![-\w])dark:' \
  "dark: variants found above — the palettes are complete, delete them" "$SRC/components"

# A standalone border utility, on a line that names no border color at all.
# `border-transparent` / `border-current` count as colors: they are a
# deliberate choice, not an omission.
BARE_BORDER='(?<![-\w])border(?:-[btlrxyse])?(?![-\w:])'
HAS_BORDER_COLOR='border(?:-[btlrxyse])?-(?:app-|transparent|current|inherit)'
run_gate "gate 3/3: no colorless border utilities" "$BARE_BORDER" \
  "colorless border found above — add an explicit border-app-* color" \
  "$SRC/components" "$HAS_BORDER_COLOR"

if [ "$status" -eq 0 ]; then
  printf '\033[32mall gates passed\033[0m\n'
fi
exit "$status"
