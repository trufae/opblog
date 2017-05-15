# 2016-11-04T12:49:15.905Z

ADRP
----

The ARM64 assembly language feels way more natural and simple than ARM or Thumb. But sometimes it is not that intuitive.

This instruction looks like this in the wild:

	adrp x0, label


bl start
_start:
	movz x1, msg-_start
	add x1, x1, x30
	movz x0, 1
	movz x2, msg_len

	movz x8, 64 ;; SYS_write
	svc 0

	movz x0, 0
	movz x8, 93 ;; SYS_exit
	svc 0
	ret
msg:
	.asciz "Hello World\n"
.equ msg_len, $$-msg

