# 2017-05-15

SETEND
------

This instruction exists on ARMv6 and it is used to specify the endianness of the data read instructions like `LDR`.

http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0489f/Cjacabbf.html

The SETEND instruction, introduced in ARMv6, allows switching the endianness of the current execution state at any privilege level, however from ARMv8 it is deprecated, disabled by default, and likely to disappear entirely in future. Supporting mixed-endianness in hardware is optional in ARMv8.

LDR + REV is recommended

When using AArch32, having the CPSR.E bit have a different value to the equivalent System Control register EE bit when in EL1, EL2, or EL3 is now deprecated. The use of the ARMv7 SETEND instruction is also deprecated. It is possible to cause the Undef exception to be taken upon executing a SETEND instruction, by setting the SCTLR.SED bit.

Arm64
-----
This data endianness is controlled independently for each Execution level. For EL3, EL2 and EL1, the relevant register of SCTLR_ELn.EE sets the endianness. The additional bit at EL1, SCTLR_EL1.E0E controls the data endian setting for EL0. In the AArch64 execution state, data accesses can be LE or BE, while instruction fetches are always LE.
Whether a processor supports both LE and BE depends upon the implementation of the processor. If only little-endianness is supported, then the EE and E0E bits are always 0. Similarly, if only big-endianness is supported, then the EE and E0E bits are at a static 1 value.


Encoding
--------

	setend le -> 000201f1
	setend be -> 000001f1

See also
--------
REV* instruction to reverse endianness

http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0489f/Cihjgdid.html
https://developer.arm.com/docs/den0024/latest/4-armv8-registers/42-processor-state
