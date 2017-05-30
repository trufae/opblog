# 2017-05-15

SETEND
======

Introduction
------------

A crash happened on my RPI3 running Raspbian, so my first though was a bug in my code, but it turned out it was throwing an illegal instruction signal, which i guessed it was a corrupted PC... But it was not, the function itself was found inside a system library that provides low level optimizations for some binary operations on ARM.

The instruction that was failing was disassembled correctly by r2 with Capstone, and it was `SETEND`. Digging a bit on the Internets and doing some tests on different devices showed up the reason behind this SIGILL.

According to the documentation, this instruction exists on ARMv6 and it is used to change the endianness of the data read instructions like `LDR`.

But unfortunetly, it was designed for deprecation right in ARMv7, some manufacturers still ship it in some ARMv7 cpus.. and none for ARMv8 (the actualy arm64 in 32bit mode). Supporting mixed-endianness in hardware is optional nowadays.

Swapping endianness has been always a bit of misterious thing, and ARM has been known to support little and big endian instruction sets as well as having support for different endianness when loading dwords from memory.

Encoding
--------

This is how the SETEND instruction is encoded:

	setend le -> 000201f1
	setend be -> 000001f1

The recommended (portable and modern) way to do that is using `REV`. This is loading the dwords and then swapping the value in the register.

	LDR r0, [r0]
	LDR r1, [r1]
	REV r0, r0
	REV r1, r0

instead of:

	SETEND BE
	LDR r0, [r0]
	LDR r1, [r1]

Arm64
-----
In ARM64, the data endianness is controlled independently for each Execution level (kernel, userland, ..).

* For `EL1,2,3`, the relevant register to set endianness is `SCTLR_ELn.EE`
* On `EL0`, the `SCTLR_EL1.E0E` does that

This control register bit change only affects the data fetches, not the instruction ones.

Whether a processor supports both LE and BE depends upon the implementation of the processor. If only little-endianness is supported, then the EE and E0E bits are always 0. Similarly, if only big-endianness is supported, then the EE and E0E bits are at a static 1 value.

When using AArch32, having the CPSR.E bit have a different value to the equivalent System Control register EE bit when in EL1, EL2, or EL3 is now deprecated. The use of the ARMv7 SETEND instruction is also deprecated. It is possible to cause the Undef exception to be taken upon executing a SETEND instruction, by setting the SCTLR.SED bit.

See also
--------
* https://developer.arm.com/docs/den0024/latest/4-armv8-registers/42-processor-state
* http://elixir.free-electrons.com/linux/latest/source/arch/arm64/include/asm/ptrace.h
* http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.den0024a/ch04s05s02.html
* https://chromium.googlesource.com/chromiumos/third_party/coreboot/+/chromeos-2015.07/payloads/libpayload/arch/arm64/lib/pstate.c
* http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0489f/Cihjgdid.html
* https://developer.arm.com/docs/den0024/latest/4-armv8-registers/42-processor-state
