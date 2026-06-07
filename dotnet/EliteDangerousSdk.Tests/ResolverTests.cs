using Xunit;
using System;
using System.IO;
using EliteDangerousSdk.Data;

namespace EliteDangerousSdk.Tests;

public class EntityResolverTests
{
    public class ResolveModule
    {
        [Fact]
        public void ResolvesFsd()
        {
            var mod = EntityResolver.ResolveModule(128064128);
            Assert.NotNull(mod);
            Assert.Equal("fsd", mod.Value.GetProperty("grp").GetString());
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveModule(-1));
        }
    }

    public class ResolveShip
    {
        [Fact]
        public void ResolvesSidewinder()
        {
            var ship = EntityResolver.ResolveShip(128049249);
            Assert.NotNull(ship);
            Assert.Contains("Sidewinder", ship.Value.GetProperty("properties").GetProperty("name").GetString());
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveShip(-1));
        }
    }

    public class ResolveShipByName
    {
        [Fact]
        public void ResolvesExactName()
        {
            var ship = EntityResolver.ResolveShipByName("Sidewinder");
            Assert.NotNull(ship);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveShipByName("nonexistent"));
        }
    }

    public class ResolveCommodity
    {
        [Fact]
        public void ResolvesGold()
        {
            var com = EntityResolver.ResolveCommodity("Gold");
            Assert.NotNull(com);
            Assert.Contains("Gold", com.Value.GetProperty("name").GetString());
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveCommodity("xyz_invalid"));
        }
    }

    public class ResolveEngineer
    {
        [Fact]
        public void ResolvesFarseer()
        {
            var eng = EntityResolver.ResolveEngineer(300100);
            Assert.NotNull(eng);
            Assert.Contains("Farseer", eng.Value.GetProperty("name").GetString());
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveEngineer(-1));
        }
    }

    public class ResolveEngineerByName
    {
        [Fact]
        public void ResolvesByName()
        {
            var eng = EntityResolver.ResolveEngineerByName("Felicity Farseer");
            Assert.NotNull(eng);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveEngineerByName("nonexistent"));
        }
    }

    public class ResolveMaterial
    {
        [Fact]
        public void ResolvesNickel()
        {
            var mat = EntityResolver.ResolveMaterial(128672319);
            Assert.NotNull(mat);
            Assert.Contains("Nickel", mat.Value.GetProperty("name").GetString());
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveMaterial(-1));
        }
    }

    public class ResolveMaterialBySymbol
    {
        [Fact]
        public void ResolvesNickel()
        {
            var mat = EntityResolver.ResolveMaterialBySymbol("Nickel");
            Assert.NotNull(mat);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveMaterialBySymbol("xyz"));
        }
    }

    public class ResolveMicroresource
    {
        [Fact]
        public void ResolvesHealthpack()
        {
            var mr = EntityResolver.ResolveMicroresource(128932270);
            Assert.NotNull(mr);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveMicroresource(-1));
        }
    }

    public class ResolveMicroresourceBySymbol
    {
        [Fact]
        public void ResolvesHealthpack()
        {
            var mr = EntityResolver.ResolveMicroresourceBySymbol("healthpack");
            Assert.NotNull(mr);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveMicroresourceBySymbol("xyz"));
        }
    }

    public class ResolveOutfitting
    {
        [Fact]
        public void ResolvesSidewinderArmour()
        {
            var o = EntityResolver.ResolveOutfitting(128049250);
            Assert.NotNull(o);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveOutfitting(-1));
        }
    }

    public class ResolveShipyard
    {
        [Fact]
        public void ResolvesSidewinder()
        {
            var s = EntityResolver.ResolveShipyard(128049249);
            Assert.NotNull(s);
        }

        [Fact]
        public void UnknownReturnsNull()
        {
            Assert.Null(EntityResolver.ResolveShipyard(-1));
        }
    }
}
